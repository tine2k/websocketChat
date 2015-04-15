$(function() {
    $("#chatContainer").hide();
    $('#connectButton')
});

var myWebSocket;

function sendMessage(event, $usernameField, $messageField) {
    if (event.keyCode == 13 && $(messageField).val().length > 0) {
        myWebSocket.send("[" + $usernameField.val() + "]: " + $messageField.val());
        $messageField.val('');
    }
}

function connect($usernameField, $chatField) {

    $("#initContainer").hide();
    $("#chatContainer").show();

    myWebSocket = new WebSocket("ws://localhost:8080/websocket");
    myWebSocket.onmessage = function(evt) {
        $chatField.val($chatField.val() + evt.data + "\n");
    };

    myWebSocket.onopen = function(evt) {
        myWebSocket.send($usernameField.val() + " hat den Raum betreten.");
    };
}