import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './Login.css';
import './ChatRoom.css';
import PropTypes from 'prop-types';
import useWebSocket from './useWebSocket';

const Login = ({ connect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { messages, sendMessage, sendGeneralMessage, setMessages, nickname, fullname, generalMessages, disconnect } = useWebSocket();

  const handleSubmit = (event) => {
    event.preventDefault();
    const nickname = event.target.elements.nickname.value;
    const fullname = event.target.elements.fullname.value;
    connect(nickname, fullname);
    setIsConnected(true);
  };

  useEffect(() => {
    if (isConnected) {
      const fetchUsers = () => {
        fetch('http://localhost:8089/users')
          .then(response => response.json())
          .then(data => {
            const filteredUsers = data.filter(user => user.nickName !== nickname);
            setUsers(filteredUsers);
          })
          .catch(error => console.error('Error fetching users:', error));
      };

      fetchUsers();
      const intervalId = setInterval(fetchUsers, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isConnected, nickname]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetch(`http://10.40.25.166/messages/${nickname}/${user.nickName}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageContent = event.target.elements.message.value;
    if (messageContent.trim()) {
      if (selectedUser) {
        sendMessage(selectedUser.nickName, messageContent);
      } else {
        sendGeneralMessage(messageContent);
      }
      event.target.elements.message.value = '';
    }
  };

  const handleLogout = () => {
    disconnect();
    setIsConnected(false);
  };

  return (
    isConnected ? (
      <div className="chat-room-container d-flex">
        <div className="user-list p-3">
          <h5>Contacts</h5>
          <ul className="list-unstyled">
            <li
              className={`user-item py-2 ${selectedUser === null ? 'active' : ''}`}
              onClick={() => setSelectedUser(null)}
            >
              General Chat
            </li>
            {users.map(user => (
              <li
                key={user.nickName}
                className={`user-item py-2 ${selectedUser && selectedUser.nickName === user.nickName ? 'active' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                {user.fullName}
              </li>
            ))}
          </ul>
          <div className="user-footer">
            <span>{fullname}</span>
            <button onClick={handleLogout} className="btn btn-secondary mt-2">Salir</button>
          </div>
        </div>
        <div className="chat-window p-3">
          <h5>{selectedUser ? selectedUser.fullName : 'General Chat'}</h5>
          <div className="chat-area">
            {(selectedUser ? messages : generalMessages).map((msg, index) => (
              <div key={index} className={`message ${msg.senderId === nickname ? 'sent' : 'received'}`}>
                {selectedUser ? msg.content : <><strong>{msg.senderId}</strong>: {msg.content}</>}
              </div>
            ))}
          </div>
          <form className="chat-input mt-3" onSubmit={handleSendMessage}>
            <input type="text" className="form-control" placeholder="Type your message" name="message" />
            <Button type="submit" className="btn btn-primary mt-2">Send</Button>
          </form>
        </div>
      </div>
    ) : (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col md={12} className="text-center">
            <h1 className="text-white">WEB CHAT</h1>
            <h2 className="text-white">LOGIN</h2>
          </Col>
          <Col md={12}>
            <Form className="p-4 rounded" onSubmit={handleSubmit}>
              <Form.Group controlId="formNickname" className="mb-3">
                <Form.Label className="text-white">Nickname</Form.Label>
                <Form.Control type="text" placeholder="Enter nickname" name="nickname" required />
              </Form.Group>
              <Form.Group controlId="formFullname" className="mb-3">
                <Form.Label className="text-white">Fullname</Form.Label>
                <Form.Control type="text" placeholder="Enter fullname" name="fullname" required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">Sign In</Button>
              <Form.Text className="text-white d-block text-center mt-3">
                <a href="#" className="text-white">Forgot password?</a>
              </Form.Text>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  );
};

Login.propTypes = {
  connect: PropTypes.func.isRequired,
};

export default Login;
