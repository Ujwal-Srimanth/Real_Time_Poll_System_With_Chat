import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import axios from 'axios';

const ChatBox = ({ username, participants = [], onKick }) => {
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants'

  useEffect(() => {
    axios.get('https://real-time-poll-system-with-chat-1.onrender.com/api/chat')
      .then((res) => setChatLog(res.data))
      .catch((err) => console.error('Failed to fetch chat history:', err.message));

    socket.on('chatMessage', (msg) => {
      setChatLog((prev) => [...prev, msg]);
    });

    return () => socket.off('chatMessage');
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      const msgObj = {
        name: username || 'Anonymous',
        message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('chatMessage', msgObj);
      setMessage('');
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #ddd',
        fontWeight: 600,
        fontSize: '14px'
      }}>
        <div
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '10px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'chat' ? '3px solid #8b5cf6' : 'none',
            color: activeTab === 'chat' ? '#8b5cf6' : '#333'
          }}
        >
          Chat
        </div>
        <div
          onClick={() => setActiveTab('participants')}
          style={{
            flex: 1,
            padding: '10px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'participants' ? '3px solid #8b5cf6' : 'none',
            color: activeTab === 'participants' ? '#8b5cf6' : '#333'
          }}
        >
          Participants
        </div>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' ? (
        <div style={{ padding: '10px' }}>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #eee',
            padding: '10px',
            backgroundColor: '#fafafa',
            marginBottom: '10px'
          }}>
            {chatLog.map((msg, idx) => {
              const isSender = msg.name === username;
              return (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: isSender ? 'flex-end' : 'flex-start',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    backgroundColor: isSender ? '#dbeafe' : '#e5e7eb',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    textAlign: isSender ? 'right' : 'left',
                  }}>
                    <div style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>
                      {msg.name} <span style={{ fontWeight: 'normal', fontSize: '11px' }}>• {new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div>{msg.message}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px 0 0 6px',
                border: '1px solid #ccc'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0 6px 6px 0',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        // Participants Tab
        <div style={{ padding: '10px' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px' }}>Name</th>
                {username === 'Teacher' && <th style={{ textAlign: 'left', padding: '6px' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {participants.map((name, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '6px' }}>{name}</td>
                  {username === 'Teacher' && (
                    <td style={{ padding: '6px' }}>
                      <span
                        style={{ color: '#2563eb', cursor: 'pointer' }}
                        onClick={() => onKick(name)}
                      >
                        Kick out
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
