$(function() {
    $("#chatContainer").hide();
});

var stompClient;
var topicName = '/topic/oenbChat';

function sendMessage(event, $usernameField, $messageField) {
    if (event.keyCode == 13 && $(messageField).val().length > 0) {
        stompClient.send(topicName,{},"[" + $usernameField.val() + "]: " + $messageField.val());
        $messageField.val('');
    }
}

function connect($usernameField, $chatField) {

    $("#initContainer").hide();
    $("#chatContainer").show();

    var myWebSocket = new WebSocket("ws://localhost:8080/stomp");
    stompClient = Stomp.over(myWebSocket);

    stompClient.connect({debug:true}, function(frame) {
        stompClient.subscribe(topicName, function(message) {
            $chatField.val($chatField.val() + message.body + "\n");
        });

        stompClient.send(topicName,{},$usernameField.val() + " hat den Raum betreten.");
    });
}

function disconnect($usernameField) {
    if (stompClient) {
        stompClient.send(topicName,{},$usernameField.val() + " hat den Raum verlassen.");
        stompClient.disconnect();
    }
}