document.addEventListener('DOMContentLoaded', () => {

    // Get username
    document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');

    // Allow typing in message box
    document.querySelector('#submit2').disabled = true;
    document.querySelector('#text').onkeyup = () => {
        if (document.querySelector('#text').value.length > 0)
            document.querySelector('#submit2').disabled = false;
        else
            document.querySelector('#submit2').disabled = true;
    };
    document.querySelector('#submit3').disabled = true;
    document.querySelector('#new-channel').onkeyup = () => {
        if (document.querySelector('#new-channel').value.length > 0)
            document.querySelector('#submit3').disabled = false;
        else
            document.querySelector('#submit3').disabled = true;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Send message
        document.querySelector('#form2').onsubmit = () => {

            // Get date, message and username
            let timestamp = new Date;
            timestamp = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let message = document.querySelector('#text').value
            let username = localStorage.getItem('registered_username')

            // Save timestamp, username and message
            let newitemschat = [timestamp, username, message]

            if (!localStorage.getItem('chat')) {
                localStorage.setItem('chat', JSON.stringify([newitemschat]));
            } else {
                var stored_chat = JSON.parse(localStorage.getItem('chat'));
                if (stored_chat.length > 100 ) {
                    stored_chat.shift();
                }
                stored_chat.push(newitemschat)
                localStorage.setItem('chat', JSON.stringify(stored_chat))
            }

            // Emit message to everyone
            socket.emit('send message', timestamp, username, message);

            // Clear input field and disable button again
            document.querySelector('#text').value = '';
            document.querySelector('#submit2').disabled = true;

            return false;
        };

        // Create channel
        document.querySelector('#form3').onsubmit = () => {

            // Get channel
            let channel = document.querySelector('#new-channel').value

            if (!localStorage.getItem('channel')) {
                localStorage.setItem('channel', JSON.stringify([channel]));
            } else {
                const itemschanel = JSON.parse(localStorage.getItem('channel'))
                if (Object.values(itemschanel).includes(channel)) {
                    alert("Please, select a different name for your channel")
                    document.querySelector('#new-channel').value = '';
                    document.querySelector('#submit3').disabled = true;
                    return false;
                }
                itemschanel.push(channel)
                localStorage.setItem('channel', JSON.stringify(itemschanel))
            }

            // Emit channel to everyone
            socket.emit('create channel', channel);

            // Clear input field and disable button again
            document.querySelector('#new-channel').value = '';
            document.querySelector('#submit3').disabled = true;

            return false;
        };
    });

    // Update messages
    socket.on('update message', data => {
        const li = document.createElement('li');
        li.innerHTML = ` ${data.timestamp} [${data.username}]: ${data.message} `;
        document.querySelector('#message_list').append(li);

        // Automatic scroll down chat box
        var objDiv = document.getElementById("chat_box");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    // Update channels
    socket.on('update channel', data => {
        var length_channel = localStorage.getItem('channel').length
        var text = data.channel;
        var name = 'RadioInputName'; // + (index + 1);
        var id = 'ID' + length_channel + 1;
      
        var row = document.createElement('div');

        var radioBut = document.createElement('input');
        radioBut.setAttribute('type', 'radio');
        radioBut.setAttribute('name', name);
        radioBut.setAttribute('id', id);
        radioBut.setAttribute('value', name);
        row.appendChild(radioBut);
      
        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.className = "list-group-item";
        label.innerHTML = text;
        row.appendChild(label);

        document.querySelector('#channel-list').append(row);

        

        // Automatic scroll down chat box
        var objDiv = document.getElementById("channel_box");
        objDiv.scrollTop = objDiv.scrollHeight;
    });
});