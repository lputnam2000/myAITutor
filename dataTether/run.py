from app import server

if __name__ == '__main__':
    server.start_worker()
    server.socketio.run(server.app, host='0.0.0.0', port=5000)