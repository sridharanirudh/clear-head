from flask import Blueprint

chat = Blueprint('/', __name__)
from . import views