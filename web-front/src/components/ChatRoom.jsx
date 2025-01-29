
import './ChatRoom.css';

const ChatRoom = () => {
  return (
    <div className="chat-room-container d-flex">
      <div className="user-list p-3">
        <h5>Contacts</h5>
        <ul className="list-unstyled">
          <li className="user-item py-2">User 2</li>
          <li className="user-item py-2">User 3</li>
        </ul>
      </div>
      <div className="chat-window p-3">
        <h5>Chats</h5>
        <div className="chat-area"></div>
        <form className="chat-input mt-3">
          <input type="text" className="form-control" placeholder="Type your message" />
          <button type="submit" className="btn btn-primary mt-2">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;