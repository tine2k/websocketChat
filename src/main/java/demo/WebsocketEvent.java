package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;
import org.springframework.web.socket.messaging.StompSubProtocolHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WebsocketEvent implements ApplicationListener<AbstractSubProtocolEvent> {

    public static final String TOPIC_MESSAGES = "/topic/oenbChat/messages";
    public static final String TOPIC_USERS = "/topic/oenbChat/users";

    private Map<String, String> users = new HashMap<>();

    @Autowired
    private SimpMessagingTemplate template;

    @Override
    public void onApplicationEvent(AbstractSubProtocolEvent event) {

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpSessionId = (String) message.getHeaders().get("simpSessionId");

        if (event instanceof SessionSubscribeEvent) {

            String destination = (String) message.getHeaders().get("simpDestination");

            Map<Object, Object> headers = (Map<Object, Object>) message.getHeaders().get("nativeHeaders");

            List<String> headerUsers = (List<String>) headers.get("user");
            String user = headerUsers.get(0);

            StompSubProtocolHandler handler = (StompSubProtocolHandler) event.getSource();

            template.convertAndSend(TOPIC_MESSAGES, user + " hat den Raum betreten.");
            users.put(simpSessionId, user);

        } else if (event instanceof SessionUnsubscribeEvent) {
            String user = users.get(simpSessionId);
            if (user != null) {
                template.convertAndSend(TOPIC_MESSAGES, user + " hat den Raum verlassen.");
                users.remove(simpSessionId);
            }
        }

        template.convertAndSend(TOPIC_USERS, String.join("\n", users.values()));
    }
}
