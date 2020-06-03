document.addEventListener('DOMContentLoaded', () => {

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
                if (stored_chat.length > 100) {
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

        var text = data.channel;
        var channel_list = document.createElement('a');
        channel_list.setAttribute('class', "list-group-item list-group-item-action");
        channel_list.setAttribute('id', "list-" + text + "-list");
        channel_list.setAttribute('data-toggle', "list");
        channel_list.setAttribute('href', "#list-" + text );
        channel_list.setAttribute('role', "tab");
        channel_list.setAttribute('aria-controls', text);
        channel_list.setAttribute('textNode', text);
        var text_inside_a = document.createTextNode(text);
        channel_list.appendChild(text_inside_a);
        document.querySelector('#channel-list').append(channel_list);

        channel_text = document.createElement('div');
        channel_text.setAttribute('class',"tab-pane fade");
        channel_text.setAttribute('id',"list-" + text);
        channel_text.setAttribute('role',"tabpanel");
        channel_text.setAttribute('aria-labelledby',"list-" + text + "-list");
        var text_inside_div = document.createTextNode(text);
        channel_text.appendChild(text_inside_div);
        document.querySelector('#channel_text').append(channel_text);

        // Automatic scroll down chat box
        var objDiv = document.getElementById("channel_box");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    // Update channels
    socket.on('wrong channel', data => {
        alert("Channel already created")
    });
});