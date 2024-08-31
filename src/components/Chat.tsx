import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat: React.FC<{user:string;}> = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Array<{ sender: string, message: string }>>([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  const sendMessage = async () => {
    const response = await axios.get('http://localhost:5000/api/users/session',{withCredentials: true})
    console.log(response.data.user);
    
    const sender = response.data.user.username; // Replace with session user
    const receiver = 'User2'; // Replace with the other user's ID
    socket.emit('send_message', { sender, receiver, message });
    setChat([...chat, { sender, message }]);
    setMessage('');
  };

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {chat.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
