from flask import Flask
from flask_socketio import SocketIO
from config import Config
from dataTether.app import events

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    socketio.init_app(app)
    register_blueprints(app)
    return app

def register_blueprints(app):
    #app.register_blueprint(events.bp)
    pass

app = create_app()

if __name__ == '__main__':
    app.run()