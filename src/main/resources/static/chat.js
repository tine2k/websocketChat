$(function() {
    $("#chatContainer").hide();
});

var stompClient;
var subscriptionUsers;
var subscriptionMessages;
var topicNameMessages = '/topic/oenbChat/messages';
var topicNameUsers = '/topic/oenbChat/users';

function sendMessage(event, $usernameField, $messageField) {
    if (event.keyCode == 13 && $(messageField).val().length > 0) {
        // message senden
        stompClient.send(topicNameMessages,{},"[" + $usernameField.val() + "]: " + $messageField.val());

        // textarea loeschen
        $messageField.val('');
    }
}

function connect($usernameField, $chatField, $userField) {

    // view switchen
    $("#initContainer").hide();
    $("#chatContainer").show();

    // 'stomp' ersetzt 'websocket'
    var myWebSocket = new WebSocket("ws://localhost:8080/stomp");
    stompClient = Stomp.over(myWebSocket);

    stompClient.connect({debug:true}, function(frame) {

        subscriptionUsers = stompClient.subscribe(topicNameUsers, function(message) {
            $userField.val(message.body);
        });

        subscriptionMessages = stompClient.subscribe(topicNameMessages, function(message) {

            // message anhaengen
            $chatField.val($chatField.val() + message.body + "\n");

            // immer nach unten scrollen
            $chatField.scrollTop($chatField[0].scrollHeight - $chatField.height());
        }, {user:$usernameField.val()});

    });
}

function disconnect($usernameField) {
    if (subscriptionMessages) {
        subscriptionMessages.unsubscribe();
    }
    if (subscriptionUsers) {
        subscriptionUsers.unsubscribe();
    }
    if (stompClient) {
        stompClient.disconnect({user:$usernameField.val()});
    }
}