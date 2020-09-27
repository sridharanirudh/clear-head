from . import chat
from app.model import User, Sessions
from flask import Flask, request, jsonify, render_template
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

@chat.route('/api/start', methods= ['POST'])
def start():
    if request.method == 'POST':
        if 'user_id' in request.form:
            req = request.json
            user_id = req['user_id']
            name = User.query.filter_by(user_id = user_id).first().name

            #TODO
            # If name doesn't exist, the next view is the root view
        else:
            req = request.json
            name = req['name']
            age = int(req['age'])
            user_id = uuid.uuid4().hex
            user = User(
                user_id=uuid.uuid4().hex,
                name = name,
                age = age
            )
            session_uuid = uuid.uuid4().hex
            sess = Sessions(
                session_uuid = session_uuid,
                user = user
            )
            db.session.add(user)
            db.session.add(sess)
            db.session.commit()

    response = {
        'messages': [f"Hey {name}, how are you doing today?"],
        'session_id': session_uuid,
        'next': 'fork',
        'user_id': user_id,
        'name': name,
        'age': age
    }
    return jsonify(response)

@chat.route('/api/fork', methods=['POST'])
def fork():
    if request.method == 'POST':
        req = request.json
        user_id = req['user_id']
        answer = req['answer'].lower()
        name = User.query.filter_by(user_id = user_id).first().name
        if answer == 'good':
            messages = [f"It's great that you are feeling good today {name}.", "Would you like to see your previous sessions?"]
            next_route = 'path1'
            is_range = False
        else:
            messages = ["How strongly do you feel like that?"]
            next_route = 'path2'
            is_range = True

        response = {
            'messages': messages,
            'next': next_route,
            'range': is_range,
        }
        return jsonify(response)

@chat.route('/api/path1', methods=['POST'])
def is_good():
    if request.method == 'POST':
        req = request.json
        yes = bool(req['answer'] == 'true')
        if not yes:
            messages = ["It was nice checking up on you. Do come by for your next session :)"]
        else:
            messages = "Temporary"
            # Need to query the sessions table for all values of user_id. Generate a plot on the start level per day"
        response = {
            'messages': messages,
            'end': True
        }
        return jsonify(response)

@chat.route('/api/path2', methods= ['POST'])
def is_bad():
    if request.method == 'POST':
        req = request.json
        quantity = int(req['answer'])
        if quantity >= 5:
            messages = ["Lets get you calm down.", "Take deep breaths for 2 minutes and only concentrate on the breathing."]
            timer = 2
        elif quantity >= 3:
            messages = ["Lets relax first.", "Take deep breaths for 1 minute and only concentrate on the breathing."]
            timer = 1

        ##TODO
        sess_id = request.form['session_id']
        sess = Sessions.query.filter_by(session_id = sess_id).first()
        sess.start_level = quantity
        db.session.commit()
        response = {
            'messages': messages,
            'timer': timer,
            'post_message': ['What has been bothering you lately?'],
        }

# @chat.route('/serious', methods= ['POST'])
# def end_fork():
#     if 
