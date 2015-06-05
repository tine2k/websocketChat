$(function() {
    $("#chatContainer").hide();
});

var stompClient;
var topicName = '/topic/oenbChat';

function sendMessage(event, $usernameField, $messageField) {
    if (event.keyCode == 13 && $(messageField).val().length > 0) {
        // message senden
        stompClient.send(topicName,{},"[" + $usernameField.val() + "]: " + $messageField.val());

        // textarea loeschen
        $messageField.val('');
    }
}

function connect($usernameField, $chatField) {

    // view switchen
    $("#initContainer").hide();
    $("#chatContainer").show();

    // 'stomp' ersetzt 'websocket'
    var myWebSocket = new WebSocket("ws://localhost:8080/stomp");
    stompClient = Stomp.over(myWebSocket);

    stompClient.connect({debug:true}, function(frame) {
        stompClient.subscribe(topicName, function(message) {

            // message anhaengen
            $chatField.val($chatField.val() + message.body + "\n");

            // immer nach unten scrollen
            $chatField.animate({ scrollTop: $(document).height() }, "slow");
        });

        stompClient.send(topicName,{},$usernameField.val() + " hat den Raum betreten.");
    });
}

function disconnect($usernameField) {
    if (stompClient) {
        // nachrichten senden, wenn man den browser schliesst
        stompClient.send(topicName,{},$usernameField.val() + " hat den Raum verlassen.");
        stompClient.disconnect();
    }
}
