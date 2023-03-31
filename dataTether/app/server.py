from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import jwt
import redis
import threading
from flask_cors import CORS
from dataTether.config import Config
import eventlet
import signal

eventlet.monkey_patch()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, async_mode='threading', ping_timeout=30, ping_interval=60, cors_allowed_origins='*')
redis_store = redis.StrictRedis(
    host=app.config['REDIS_HOST'],
    port=app.config['REDIS_PORT'],
    db=app.config['REDIS_DB'],
    password=app.config['REDIS_PASSWORD']
)
pubsub = redis_store.pubsub()
worker = None

def start_worker():
    global worker
    worker = threading.Thread(target=listen_for_updates)
    worker.start()

def listen_for_updates():
    pubsub.psubscribe('__keyspace@0__:user:*')
    for message in pubsub.listen():
        print(message)
        if message['type'] == 'pmessage':
            broken_up_key = message['channel'].decode('utf-8').split(':')
            if broken_up_key[1] == 'user':
                user_id = broken_up_key[2] # Assumes key is 'user:<user_id>'
                value = redis_store.get('user:'+str(user_id))
                if value is not None:
                    socketio.emit('redis_update', str(value), room=user_id)
                    print("emmitting: ", value)
        print("handled")

@socketio.on('connect')
def handle_connect():
    print("connection being made!")
    token = request.args.get('token')
    print("token: ", token)
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        print("payload: ",payload)
        user_id = payload.get('sub')
        print("user_id: ", user_id)
        join_room(user_id)
        #redis_key = f'user:{user_id}'
        #emit('redis_update', redis_store.get(redis_key))
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
