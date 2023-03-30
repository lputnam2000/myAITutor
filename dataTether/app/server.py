from flask import Flask, request
from flask_socketio import SocketIO, emit
import jwt
import redis
import threading

app = Flask(__name__)
app.config.from_object('config.Config')
socketio = SocketIO(app, ping_timeout=30, ping_interval=10)
redis_store = redis.StrictRedis(host=app.config['REDIS_HOST'], port=app.config['REDIS_PORT'], db=app.config['REDIS_DB'])
pubsub = redis_store.pubsub()
worker = None

def start_worker():
    global worker
    worker = threading.Thread(target=listen_for_updates)
    worker.start()

def listen_for_updates():
    for message in pubsub.listen():
        if message['type'] == 'message':
            data = message['data']
            user_id = data.decode('utf-8').split(':')[1] # Assumes key is 'user:<user_id>'
            redis_key = f'user:{user_id}'
            value = redis_store.get(redis_key)
            if value is not None:
                emit('redis_update', value, room=user_id)

@socketio.on('connect')
def handle_connect():
    token = request.args.get('token')
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload.get('user_id')
        join_room(user_id)
        redis_key = f'user:{user_id}'
        emit('redis_update', redis_store.get(redis_key))
    except (jwt.InvalidSignatureError, jwt.DecodeError):
        pass

@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.sid
    leave_room(user_id)

if __name__ == '__main__':
    start_worker()
    socketio.run(app, host='0.0.0.0', port=5000)
