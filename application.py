import os

from flask import Flask,render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# votes = {"yes": 0, "no": 0, "maybe": 0}
# chats = {"groups": 0, "private": 0}
# 

@app.route("/")
def index():
    return render_template("home.html")

@app.route("/register/")
def register():
    return render_template("register.html")

@app.route("/home")
def home():
    return render_template("home.html")

@socketio.on("send message")
def send_message(timestamp, username, message):
    # channelchat.append({"timestamp": timestamp,"username": username, "message": message})
    emit("update message", {"timestamp": timestamp,"username": username, "message": message}, broadcast=True)