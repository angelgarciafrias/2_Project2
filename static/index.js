document.addEventListener('DOMContentLoaded', () => {

    // Index function
    // Start local storage variable
    if (!localStorage.getItem('registered_username'))
        localStorage.setItem('registered_username', "");

    // Get value from local storage
    if (localStorage.getItem('registered_username') != "")
        document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');
    
    if (localStorage.getItem('registered_username') == "")
        // Enable button only if there is text in the input field (otherwise is disabled)
        document.querySelector('#submit').disabled = true;
        document.querySelector('#username').onkeyup = () => {
            if (document.querySelector('#username').value.length > 0)
                document.querySelector('#submit').disabled = false;
            else
                document.querySelector('#submit').disabled = true;
        };

    // Update username value from input
    document.querySelector('#form').onsubmit = () => {
        const username = document.querySelector('#username').value;
        localStorage.setItem('registered_username', username);
        var username_global = localStorage.getItem('registered_username');
    };
});