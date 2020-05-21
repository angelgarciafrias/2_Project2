import os

from flask import Flask,render_template, request
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


votes = {"yes": 0, "no": 0, "maybe": 0}
chats = {"groups": 0, "private": 0}

@app.route("/register/")
def register():
    return render_template("register.html")

@app.route("/home")
def home():
    return render_template("home.html",votes=votes)

@socketio.on("send message")
def vote(data):
    selection = data["selection"]
    emit("update messages", {"selection": selection}, broadcast=True)