from app.server import app, socketio, run_app



if __name__ == "__main__":
    run_app()
    socketio.run(app)
else:
    run_app()