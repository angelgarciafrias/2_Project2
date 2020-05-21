document.addEventListener('DOMContentLoaded', () => {

    // Home function
    // Enable button only if there is text in the input field (otherwise is disabled)
    document.querySelector('#submit2').disabled = true;
    document.querySelector('#channel').onkeyup = () => {
        if (document.querySelector('#channel').value.length > 0)
            document.querySelector('#submit2').disabled = false;
        else
            document.querySelector('#submit2').disabled = true;
    };

    // Update username value from input
    document.querySelector('#form2').onsubmit = () => {
        const li = document.createElement('li');
        li.innerHTML = document.querySelector('#channel').value;

        // Add new item to task list
        document.querySelector('#channels').append(li);

        // Clear input field and disable button again
        document.querySelector('#channel').value = '';
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
                    socket.emit('submit vote', {'selection': selection});
                };
            });
        });
    
        // When a new vote is announced, add to the unordered list
        socket.on('vote totals', data => {
            document.querySelector('#yes').innerHTML = data.yes;
            document.querySelector('#no').innerHTML = data.no;
            document.querySelector('#maybe').innerHTML = data.maybe;
        });
});