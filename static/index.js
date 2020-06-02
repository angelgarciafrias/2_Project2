document.addEventListener('DOMContentLoaded', () => {

    // Index function
    // Start local storage variable and redirect to register
    // if (!localStorage.getItem('registered_username') || localStorage.getItem('registered_username') == "") {
    //     localStorage.setItem('registered_username', "");
    //     window.location.replace('/register/');
    // }
    // // Get username from local storage
    // if (localStorage.getItem('registered_username') != "") {
    //     document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');
    // }

    // Get chats from local storage
    var stored_chat = JSON.parse(localStorage.getItem('chat'));
    for (let index = 0; index < stored_chat.length; index++) {
        const li = document.createElement('li');
        li.innerHTML = ` ${stored_chat[index][0]} [${stored_chat[index][1]}]: ${stored_chat[index][2]} `;
        document.querySelector('#message_list').append(li);
    }

    // Line of old messages
    const li2 = document.createElement('li');
    li2.innerHTML = `-------------------------------------------Old messages------------------------------------------- `;
    document.querySelector('#message_list').append(li2);

    // Get channels from local storage
    // if (!localStorage.getItem('channel')) {
    //     localStorage.setItem('channel', "");
    // } else {
    //     var stored_channel = JSON.parse(localStorage.getItem('channel'));
    //     for (let index = 0; index < stored_channel.length; index++) {

    //             var text = stored_channel[index];
    //             var name = 'RadioInputName'; // + (index + 1);
    //             var id = 'ID' + index;
              
    //             var row = document.createElement('div');
                
    //             var radioBut = document.createElement('input');
    //             radioBut.setAttribute('type', 'radio');
    //             radioBut.setAttribute('name', name);
    //             radioBut.setAttribute('id', id);
    //             radioBut.setAttribute('value', text);
    //             row.appendChild(radioBut);
                
    //             var label = document.createElement('label');
    //             label.setAttribute('for', id);
    //             label.className = "list-group-item";
    //             label.innerHTML = text;
    //             row.appendChild(label);

    //             document.querySelector('#channel-list').append(row);
    //     }
    // }

});