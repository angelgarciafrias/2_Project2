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

            // Emit message to everyone
            socket.emit('send message', timestamp, message);

            // Clear input field and disable button again
            document.querySelector('#text').value = '';
            document.querySelector('#submit2').disabled = true;

            return false;
        };

        // Enter channel
        socket.emit('enter');

        // Add active user
        socket.on('add active user', data => {
            const li3 = document.createElement('li');
            li3.innerHTML = ` ${data.username} `;
            li3.setAttribute("id", data.username);
            document.querySelector('#user_list').append(li3);
        });

        // Leave channel
        document.querySelector('#leave').addEventListener('click', () => {
            socket.emit('leave');
        });

        // Remove active user
        socket.on('remove active user', data => {
            var elem = document.getElementById(data.username);
            elem.parentNode.removeChild(elem);
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
    })
})