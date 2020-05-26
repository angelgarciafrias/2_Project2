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

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Send message
        document.querySelector('#form2').onsubmit = () => {
            
            // Get date, message and username
            let timestamp = new Date;
            timestamp = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            let message = document.querySelector('#text').value
            let username = localStorage.getItem('registered_username')

            // Save timestamp, username and message
            let newitemschat = [timestamp,username,message]
            if (!localStorage.getItem('chat')) {
                localStorage.setItem('chat', JSON.stringify([newitemschat]));
            } else {
                const itemschat = JSON.parse(localStorage.getItem('chat'))
                itemschat.push(newitemschat)
                localStorage.setItem('chat', JSON.stringify(itemschat))
            }
            
            // Emit info to everyone
            socket.emit('send message', timestamp, username, message);
            
            // Clear input field and disable button again
            document.querySelector('#text').value = '';
            document.querySelector('#submit2').disabled = true;

            return false;
        };

    });

    // Update messages in channel
    socket.on('update message', data => {
        const li = document.createElement('li');
        li.innerHTML = ` ${data.timestamp} [${data.username}]: ${data.message} `;
        document.querySelector('#message_list').append(li);

        var objDiv = document.getElementById("chat_box");
        objDiv.scrollTop = objDiv.scrollHeight;
    });



});