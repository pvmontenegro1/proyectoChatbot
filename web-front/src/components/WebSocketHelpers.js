import { over } from 'stompjs';
import SockJS from 'sockjs-client';

export const createWebSocketClient = (url) => {
  const socket = new SockJS(url);
  return over(socket);
};