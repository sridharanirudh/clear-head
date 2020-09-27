from app import db
from sqlalchemy import *
from sqlalchemy.dialects.postgresql import UUID
import uuid

class GUID(TypeDecorator):
    impl = String(32)

    def process_bind_param(self, value, dialect):
        if value is not None:
            return "%.32x" % value
        else:
            return MNone

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            return uuid.UUID(value)


class User(db.Model):

    __tablename__ = "users"
    id = db.Column(
        db.Integer,
        primary_key = True,
        nullable = False,
    )
    user_id = db.Column(
        db.String(32),
    )
    name = db.Column(
        db.String(60)
    )
    age = db.Column(
        db.Integer()
    )

    def __repr__(self):
        return f"<Username:{name} Age: {age}>"


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
        db.Integer()
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