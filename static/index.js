document.addEventListener('DOMContentLoaded', () => {

    // Index function
    // Start local storage variable
    if (!localStorage.getItem('registered_username') || localStorage.getItem('registered_username') == "") {
        localStorage.setItem('registered_username', "");
        window.location.replace('/register/');
    }
    // Get value from local storage
    if (localStorage.getItem('registered_username') != "") {
        document.querySelector('#registered_username').innerHTML = localStorage.getItem('registered_username');
    }
});