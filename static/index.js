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

            // Emit message to everyone
            socket.emit('send message', timestamp, username, message);

            // Clear input field and disable button again
            document.querySelector('#text').value = '';
            document.querySelector('#submit2').disabled = true;

            return false;
        };

        // Leave channel
        document.querySelector('#leave').addEventListener('click', () => {
            socket.emit('leave');
        })

        // Enter channel
        socket.emit('enter');

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