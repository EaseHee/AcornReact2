import { useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (setChats) => {
    const [stompClient, setStompClient] = useState(null);

    const connectWebSocket = useCallback(() => {
        const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log("STOMP Debug: ", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 0,
            heartbeatOutgoing: 0,
        });

        client.onConnect = () => {
            console.log("[연결 성공] subscribing to:", `/sub/chat/message`);
            client.subscribe(`/sub/chat/message`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setChats((prevMessages) => [...prevMessages, receivedMessage]);
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [setChats]);

    return { stompClient, connectWebSocket };
};

export default useWebSocket;