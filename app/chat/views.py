from . import chat
from app.model import User, Sessions
from flask import Flask, request, jsonify
from app import db
import uuid

@chat.route('/', methods= ['GET', 'POST'])
def introduction():
    if request.method == 'GET':
        message = "Hi, to get started let us know your name and age :)"

    return message

@chat.route('/start', methods= ['POST'])
def start():
    if request.method == 'POST':
        if 'user_id' in request.form:
            user_id = request.form['user_id']
            name = User.query.filter_by(user_id = user_id).first().name

            ##TODO
            ## If name doesn't exist, the next view is the root view
        
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

    response = {
        'message': [f"Hey {name}, how are you doing today?"],
        'next': 'fork',
    }
    return jsonify(response)

@chat.route('/fork', methods= ['POST'])
def fork():
    if request.method == 'POST':
        answer = request.form['answer'].lower()
        name = request.form['name']
        if answer == 'good':
            message = [f"It's great that you are feeling good today {name}. Would you like to see your previous sessions?"]
            next_route = 'path1'
            is_range = False
        else:
            message = ["How strongly do you feel like that?"]
            next_route = 'path2'
            is_range = True

        response = {
            'message': message,
            'next': next_route,
            'range': is_range,
        }
        return jsonify(response)

@chat.route('/path1', methods= ['POST'])
def is_good():
    if request.method == 'POST':
        yes = bool(request.form['answer'] == 'true')
        if not yes:
            message = ["It was nice checking up on you. Do come by for your next session :)"]
        else:
            message = "Temporary"
            # Need to query the sessions table for all values of user_id. Generate a plot on the start level per day"


        response = {
            'message': message,
            'end': True
        }
        return jsonify(response)

@chat.route('/path2', methods= ['POST'])
def is_bad():
    if request.method == 'POST':
        quantity = int(request.form['answer'])
        if quantity >= 5:
            message = ["Lets get you calm down.", "Take deep breaths for 2 minutes and only concentrate on the breathing."]
            timer = 2
        elif quantity >= 3:
            message = ["Lets relax first.", "Take deep breaths for 1 minute and only concentrate on the breathing."]
            timer = 1

        ##TODO
        #Create session db

        response = {
            'message': message,
            'timer': timer,
            'post_message': ['What has been bothering you lately?'],
        }