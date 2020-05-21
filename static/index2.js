document.addEventListener('DOMContentLoaded', () => {

    // get username
    document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');

    // Home function
    // Enable button only if there is text in the input field (otherwise is disabled)
    document.querySelector('#submit2').disabled = true;
    document.querySelector('#message').onkeyup = () => {
        if (document.querySelector('#message').value.length > 0)
            document.querySelector('#submit2').disabled = false;
        else
            document.querySelector('#submit2').disabled = true;
    };

    // Update username value from input
    document.querySelector('#form2').onsubmit = () => {
        const li = document.createElement('li');
        li.innerHTML = document.querySelector('#message').value;

        // Add new item to task list
        document.querySelector('#messages').append(li);

        // Clear input field and disable button again
        document.querySelector('#message').value = '';
        document.querySelector('#submit2').disabled = true;

        // Stop form from submitting
        return false;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
        document.querySelectorAll('button').forEach(button => {
            button.onclick = () => {
                const selection = button.dataset.vote;
                socket.emit('send message', {'selection': selection});
            };
        });
    });

    // When a new vote is announced, add to the unordered list
    socket.on('update messages', data => {
        const li = document.createElement('li');
        let timestamp = new Date;
        timestamp = timestamp.toLocaleTimeString();
        li.innerHTML = ` ${timestamp} ${localStorage.getItem('registered_username')} ${data.selection}`;
        document.querySelector('#message_list').append(li);
    });

});