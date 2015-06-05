package demo;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 * Created by tine2k on 15/04/15.
 */
public class MyHandler implements WebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
    }

    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {

        System.out.println(webSocketMessage.getPayload());

        // Nachricht auch an alle anderen schicken
        webSocketSession.sendMessage(webSocketMessage);

        // Timer timer = new Timer();
        // timer.schedule(new TimerTask() {
        // @Override
        // public void run() {
        // try {
        // webSocketSession.sendMessage(new TextMessage("Danke für deine Nachricht!"));
        // } catch (IOException e) {
        // throw new RuntimeException(e);
        // }
        // }
        // }, 1000, 1000);
    }

    @Override
    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {

    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
