import os

from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SESSION_PERMANET"] = True
app.config["SECRET_KEY"] = "my secret key"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

socketio = SocketIO(app)

user_list = []
channel_list = []
chat_list = dict()

@app.route("/")
def index():

    if "username" in session:
        return render_template("index.html",channel_list=channel_list,chat_list=chat_list)

    return render_template("register.html")

@app.route("/register/", methods = ["GET", "POST"])
def register():
    if request.method == "POST":
      session["username"] = request.form.get("username")
      if session["username"] in user_list:
          return render_template("error.html",message="Please, try with a different username")
      user_list.append(session["username"])
      session.permanent = True
      return redirect(url_for('index'))

    return render_template("register.html")

@app.route("/logout/")
def logout():
    try:
        user_list.remove(session['username'])
    except:
        pass
    session.clear()
    return redirect("/")

@socketio.on("send message")
def send_message(timestamp, username, message):
    chat_list[session.get("channel")].append([timestamp, session.get("username"), message])
    emit("update message", {"timestamp": timestamp,"username": session.get("username"), "message": message}, broadcast=True)

@socketio.on("create channel")
def create_channel(channel):
    if channel in channel_list:
        emit("wrong channel", {"channel": channel}, broadcast=False)
    else:
        channel_list.append(channel)
        emit("update channel", {"channel": channel}, broadcast=True)