import os

from flask import Flask,render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

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
    emit("update message", {"timestamp": timestamp,"username": username, "message": message}, broadcast=True)

@socketio.on("create channel")
def create_channel(channel):
    emit("update channel", {"channel": channel}, broadcast=True)