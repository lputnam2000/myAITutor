from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import jwt
import redis
import threading
from flask_cors import CORS
from dataTether.config import Config
import eventlet
import signal
import json

eventlet.monkey_patch()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, async_mode='threading', ping_timeout=30, ping_interval=60, cors_allowed_origins='*')

pool = redis.ConnectionPool(
    host=app.config['REDIS_HOST'],
    port=app.config['REDIS_PORT'],
    db=app.config['REDIS_DB'],
    password=app.config['REDIS_PASSWORD'],
    retry_on_timeout=True,
    max_connections=10,  # maximum number of connections in the pool
    socket_timeout=30,    # timeout for socket operations
    socket_keepalive=True,
    health_check_interval=30  # interval to check the health of the connections
)
redis_store = redis.Redis(connection_pool=pool)

pubsub = None
worker = None

def start_worker():
    global worker, pubsub
    pubsub = redis_store.pubsub()
    worker = threading.Thread(target=listen_for_updates)
    worker.start()

def listen_for_updates():
    global pubsub, redis_store
    while True:
        try:
            if pubsub == None:
                pubsub = redis_store.pubsub()
            pubsub.psubscribe('__keyspace@0__:user:*')
            pubsub.subscribe('push_to_user')
            for message in pubsub.listen():
                if message['type'] == 'message':
                    if message['channel'].decode('utf-8') == "push_to_user":
                        data = json.loads(message['data'])
                        user_id = data['userid']
                        content = data['content']
                        if user_id:
                            socketio.emit('push_to_user', str(content), room=user_id)
                if message['type'] == 'pmessage':
                    broken_up_key = message['channel'].decode('utf-8').split(':')
                    if broken_up_key[1] == 'user':
                        user_id = broken_up_key[2] # Assumes key is 'user:<user_id>'
                        value = redis_store.get('user:'+str(user_id))
                        if value is not None:
                            socketio.emit('redis_update', str(value), room=user_id)
        except (redis.exceptions.TimeoutError, redis.exceptions.ConnectionError):
            print("Redis connection error, reconnecting...")
            redis_store.connection_pool.disconnect()
            redis_store = redis.Redis(connection_pool=pool)
            pubsub = redis_store.pubsub()

@socketio.on('connect')
def handle_connect():
    print("connection being made!")
    token = request.args.get('token')
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload.get('sub')
        print("user_id: ", user_id)
        join_room(user_id)
        value = redis_store.get('user:'+str(user_id))
        if value is not None:
            socketio.emit('redis_update', str(value), room=user_id)
    except (jwt.InvalidSignatureError, jwt.DecodeError):
        print("JWT Authentication Error")
        pass

@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.sid
    leave_room(user_id)

def signal_handler(sig, frame):
    print('Server stopped by user')
    pubsub.unsubscribe()
    redis_store.close()
    socketio.stop()

if __name__ == '__main__':
    start_worker()
    signal.signal(signal.SIGINT, signal_handler)
    socketio.run(app, host='0.0.0.0', port=5050)
