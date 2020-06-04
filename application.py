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
active_users_list = []
channel_list = []
chat_list = dict()

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

@app.route("/", methods = ["GET", "POST"])
def index():

    if "username" in session:
        if request.method == "POST":
            new_channel = request.form.get("new-channel")
            
            if new_channel in channel_list:
                return render_template("error.html", message="Not a valid channel.")
            
            channel_list.append(new_channel)
            chat_list[new_channel] = [["","system","Welcome to the new channel"]]
            return redirect("/channel/" + new_channel)

        return render_template("index.html",channel_list=channel_list,user_list=user_list)

    return render_template("register.html")

@app.route("/channel/<string:channel>")
def channel(channel):

    if channel in channel_list:
        session["channel"] = channel
        if session["username"] not in active_users_list:
            active_users_list.append(session['username'])
        return render_template("chat.html",active_users_list=active_users_list,chat_list=chat_list[channel])
    else:
        return render_template("error.html", message="Not a valid channel.")

@socketio.on("leave")
def leave_channel():

    active_users_list.remove(session['username'])

    emit("update message", {
        "timestamp": "--------------", "username": session.get("username"),
        "message": "Has left the channel--------------"
        }, broadcast=True)

@socketio.on("enter")
def enter_channel():
    
    if session["username"] not in active_users_list:
        active_users_list.append(session['username'])

    emit("update message", {
        "timestamp": "--------------", "username": session.get("username"),
        "message": "Has entered the channel--------------"
        }, broadcast=True)

@socketio.on("send message")
def send_message(timestamp, username, message):
    
    channel = session.get("channel")
    if len(chat_list[channel]) > 100:
        chat_list[channel].pop(0)
    chat_list[channel].append([timestamp, session.get("username"), message])

    emit("update message", {"timestamp": timestamp,"username": session.get("username"), "message": message}, broadcast=True)
