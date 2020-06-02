document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#submit2').disabled = true;
    document.querySelector('#text').onkeyup = () => {
        if (document.querySelector('#text').value.length > 0)
            document.querySelector('#submit2').disabled = false;
        else
            document.querySelector('#submit2').disabled = true;
    };

    document.querySelector('#submit3').disabled = true;
    document.querySelector('#new-channel').onkeyup = () => {
        if (document.querySelector('#new-channel').value.length > 0)
            document.querySelector('#submit3').disabled = false;
        else
            document.querySelector('#submit3').disabled = true;
    };

    // Automatic scroll down chat box
    var objDiv = document.getElementById("chat_box");
    objDiv.scrollTop = objDiv.scrollHeight;

    // Automatic scroll down channel box
    var objDiv = document.getElementById("channel_box");
    objDiv.scrollTop = objDiv.scrollHeight;

});