from . import chat
from app.model import User, Sessions
from flask import Flask, request, render_template
from app import db
import uuid

@chat.route('/', methods= ['GET', 'POST'])
def index():
    return render_template('index.html')

@chat.route('/intro', methods= ['GET', 'POST'])
def introduction():
    if request.method == 'GET':
        message = "Hi, to get started let us know your name and age :)"

    return message

@chat.route('/start', methods= ['POST'])
def start():
    if request.method == 'POST':
        if 'user_id' in request.form:
            # TODO
            pass
        else:
            name = request.form['name']
            age = int(request.form['age'])
            user = User(
                user_id=uuid.uuid4().hex,
                name = name,
                age = age
            )
            db.session.add(user)
            db.session.commit()
    """
    TBD: find out the name of the user through the session id. need to discuss how. 
    Maybe required to store a row in session table.
    """
    # else:
    #     query = Sessions.query.filter_by(user_id)

    message = f"Hey {name}, how are you doing today?"
    return message

@chat.route('/fork', methods= ['POST'])
def fork():
    if request.method == 'POST':
        answer = request.form['answer']
        name = request.form['name']
        if answer == 'GOOD':
            message = f"It's great that you are feeling good today {name}. Would you like to see your previous sessions?"
        else:
            message = "How strongly do you feel like that?"
        return message

@chat.route('/path1', methods= ['POST'])
def is_good():
    if request.method == 'POST':
        yes = bool(request.form['answer'])
        if not yes:
            message = "It was nice checking up on you. Do come by for your next session :)"
        else:
            message = "Temporary"
            """
            Need to query the sessions table for all values of user_id. Generate a plot on the start level per day"
            """
        return message

