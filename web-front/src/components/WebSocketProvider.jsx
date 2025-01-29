import { createContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { createWebSocketClient } from './WebSocketHelpers';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [generalMessages, setGeneralMessages] = useState([]); // For general chat messages
  const [nickname, setNickname] = useState(null);
  const [fullname, setFullname] = useState(null);
  const subscriptions = useRef({});

  useEffect(() => {
    const onConnected = () => {
      if (stompClient) {
        if (!subscriptions.current[`/user/${nickname}/queue/messages`]) {
          const userSub = stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
          subscriptions.current[`/user/${nickname}/queue/messages`] = userSub;
        }
        if (!subscriptions.current['/user/public']) {
          const publicSub = stompClient.subscribe(`/user/public`, onMessageReceived);
          subscriptions.current['/user/public'] = publicSub;
        }
        if (!subscriptions.current['/topic/general']) { // Subscribe to general chat
          const generalSub = stompClient.subscribe('/topic/general', onGeneralMessageReceived);
          subscriptions.current['/topic/general'] = generalSub;
        }
        stompClient.send('/app/user.addUser', {}, JSON.stringify({ nickName: nickname, fullName: fullname, status: 'ONLINE' }));
      }
    };

    const onError = (error) => {
      console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
    };

    const onMessageReceived = (message) => {
      const payload = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, payload]);
    };

    const onGeneralMessageReceived = (message) => {
      const payload = JSON.parse(message.body);
      setGeneralMessages((prevMessages) => [...prevMessages, payload]);
    };

    if (connected && stompClient) {
      stompClient.connect({}, onConnected, onError);
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [connected, stompClient, nickname, fullname]);

  const connect = (nickname, fullname) => {
    setNickname(nickname);
    setFullname(fullname);
    const client = createWebSocketClient('http://localhost:8089/ws');
    setStompClient(client);
    setConnected(true);
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.send('/app/user.disconnectUser', {}, JSON.stringify({ nickName: nickname }));
      stompClient.disconnect();
      setConnected(false);
      setNickname(null);
      setFullname(null);
      setMessages([]);
      setGeneralMessages([]);
    }
  };

  const sendMessage = (recipientId, content) => {
    if (stompClient) {
      const chatMessage = {
        senderId: nickname,
        recipientId: recipientId,
        content: content,
        timestamp: new Date()
      };
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
    }
  };

  const sendGeneralMessage = (content) => {
    if (stompClient) {
      const chatMessage = {
        senderId: nickname,
        content: content,
        timestamp: new Date()
      };
      stompClient.send('/app/chat.general', {}, JSON.stringify(chatMessage));
      setGeneralMessages((prevMessages) => [...prevMessages, chatMessage]);
    }
  };

  return (
    <WebSocketContext.Provider value={{ connect, sendMessage, sendGeneralMessage, disconnect, messages, generalMessages, setMessages, nickname, fullname }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { WebSocketContext };
