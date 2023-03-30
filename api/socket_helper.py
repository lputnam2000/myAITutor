from flask_socketio import SocketIO

socketio = SocketIO()


def send_update(socketio, user_id, channel, data):
    print(f'SENDING UPATE {channel} \n\n\n\n')
    socketio.emit(channel, data, room=user_id)