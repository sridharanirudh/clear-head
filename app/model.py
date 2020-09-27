from app import db
from sqlalchemy import *
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(db.Model):

    __tablename__ = "users"
    id = db.Column(
        db.Integer,
        primary_key = True,
        nullable = False,
    )
    user_id = db.Column(
        db.String(32)
    )
    name = db.Column(
        db.String(60),
        nullable = False
    )
    age = db.Column(
        db.Integer(),
        default = 0
    )

    def __repr__(self):
        return f"<Username:{name} Age: {age}>"

    def __init__(self, name, age, user_id):
        self.name = name
        self.age = age
        self.user_id = user_id

class Sessions(db.Model):
    
    __tablename__ = "sessions"

    session_id = db.Column(
        db.Integer,
        primary_key = True,
        nullable = False,
    )
    session_uuid = db.Column(
        db.String(32),
    )
    #Add a range on level to be between 0 and 10
    start_level = db.Column(
        db.Integer(),
        default = -1
    )
    end_level = db.Column(
        db.Integer(),
        default = -1
    )

    time_created = db.Column(
        DateTime(timezone=True), 
        server_default=func.now()
    )

    time_updated = db.Column(
        DateTime(timezone=True), 
        onupdate=func.now()
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False
    )

    user = db.relationship('User', backref=db.backref('users', lazy=True))