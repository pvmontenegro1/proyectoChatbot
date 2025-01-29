// App.jsx
import { WebSocketProvider } from './components/WebSocketProvider';
import useWebSocket from './components/useWebSocket';
import Login from './components/Login';
import './App.css';

const AppContent = () => {
  const { connect } = useWebSocket();

  return (
    <div className="App">
      <Login connect={connect} />
      {/* <UserRegister /> */}
      {/* <ChatRoom /> */}
    </div>
  );
};

const App = () => {
  return (
    <WebSocketProvider>
      <AppContent />
    </WebSocketProvider>
  );
};

export default App;
