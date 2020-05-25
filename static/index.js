document.addEventListener('DOMContentLoaded', () => {

    // Index function
    // Start local storage variable and redirect to register
    if (!localStorage.getItem('registered_username') || localStorage.getItem('registered_username') == "") {
        localStorage.setItem('registered_username', "");
        window.location.replace('/register/');
    }
    // Get username from local storage if there is any
    if (localStorage.getItem('registered_username') != "") {
        document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');
    }

    // Get chats from local storage
    var stored_chat = JSON.parse(localStorage.getItem('chat'));

    for (let index = 0; index < stored_chat.length; index++) {
        const li = document.createElement('li');
        li.innerHTML = ` ${stored_chat[index][0]} [${stored_chat[index][1]}]: ${stored_chat[index][2]} `;
        document.querySelector('#message_list').append(li);
    }

});