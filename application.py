import os

from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session
from flask_socketio import SocketIO, send, emit, join_room, leave_room

app = Flask(__name__)
app.config["SESSION_PERMANET"] = True
app.config["SECRET_KEY"] = "my secret key"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)

user_list = []
channel_list = []
active_user_list = dict()
chat_list = dict()

@app.route("/register/", methods=["GET", "POST"])
def register():
    if request.method == "POST":
      session["username"] = request.form.get("username")
      if session["username"] in user_list:
          return render_template("error.html", message="Please, try with a different username")

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

@app.route("/", methods=["GET", "POST"])
def index():

    if "username" in session:
        if request.method == "POST":
            new_channel = request.form.get("new-channel")

            if new_channel in channel_list:
                return render_template("error.html", message="Not a valid channel.")

            channel_list.append(new_channel)
            chat_list[new_channel] = [["", "system", "Welcome to the new channel"]]
            active_user_list[new_channel] = [""]
            return redirect("/channel/" + new_channel)

        return render_template("index.html", channel_list=channel_list)

    return render_template("register.html")

@app.route("/channel/<string:channel>")
def channel(channel):

    if channel in channel_list:
        session["channel"] = channel
        return render_template("chat.html", chat_list=chat_list[channel],active_user_list=active_user_list[channel])
    else:
        return render_template("error.html", message="Not a valid channel.")

@socketio.on("enter")
def enter_channel():

    channel = session.get("channel")
    active_user_list[channel].append([session.get("username")])
    join_room(channel)

    emit("add active user",
        {"username": session.get("username")},
        room=channel)

@socketio.on("leave")
def leave_channel():

    channel = session.get("channel")
    active_user_list[channel].append([session.get("username")])
    leave_room(channel)

    emit("remove active user",
        {"username": session.get("username")},
        room=channel)

@socketio.on("send message")
def send_message(timestamp, message):

    channel = session.get("channel")
    if len(chat_list[channel]) > 100:
        chat_list[channel].pop(0)
    chat_list[channel].append([timestamp, session.get("username"), message])

    emit("update message",
        {"timestamp": timestamp, "username": session.get("username"), "message": message},
        room=channel)
