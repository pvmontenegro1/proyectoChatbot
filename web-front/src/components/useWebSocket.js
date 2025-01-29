
import { useContext } from 'react';
import { WebSocketContext } from './WebSocketProvider';

const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default useWebSocket;
