from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from config import app_config
from flask_migrate import Migrate
# from model import User, Sessions

db = SQLAlchemy()

def create_app(config_name):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')
    db.init_app(app)

    migrate = Migrate(app, db)
    from app import model

    from .chat import chat as chat_blueprint
    app.register_blueprint(chat_blueprint)

    # @app.route('/', methods= ['GET', 'POST'])
    # def introduction():
    #     if request.method == 'GET':
    #         message = "Hi, to get started let us know your name and age :)"
    #         return message
    #     elif request.method == "POST":
    #         message = "Hello"
    #         return message
    #     return render_template('index.html')
    return app
