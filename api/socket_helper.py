from flask_socketio import SocketIO
import json
socketio = SocketIO()


def send_update(socketio, user_id, channel, data):
    message = json.dumps(data)
    print(f'SENDING UPDATE-{channel}: {message}')
    socketio.emit(channel, message, room=user_id)