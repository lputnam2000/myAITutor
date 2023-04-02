from app.server import app, socketio, run_app

def run_the_app():
    print('Starting the app...')
    run_app()
    print('App started successfully!')
    socketio.run(app)
