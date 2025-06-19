import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import axios from 'axios';
import ChatBox from './ChatBox';

const StudentPoll = ({ poll, studentName, onAnswer }) => {
  const [participants, setParticipants] = useState([]);
  socket.emit('getParticipants');
  socket.on('participantList', (list) => setParticipants(list));
  const [selected, setSelected] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(poll.duration || 60);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onAnswer();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (selected !== null) {
      try {
        await axios.post('https://real-time-poll-system-with-chat-1.onrender.com/api/polls/answer', {
          pollId: poll._id,
          studentName,
          answer: poll.options[selected].text,
        });
        onAnswer();
      } catch (err) {
        console.error('❌ Error submitting answer:', err.response?.data?.message || err.message);
        alert(err.response?.data?.message || 'Submission failed');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      padding: '60px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        minWidth: '700px',
        fontSize: '16px'
      }}>
        {/* Header: Question and Timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Question 1</h2>
          <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="red" width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
              <path d="M12 8v5h4v-2h-2V8z" />
              <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9z" />
            </svg>
            <span style={{ color: 'red' }}>{String(secondsLeft).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Question Text */}
        <div style={{
          background: '#4b5563',
          color: 'white',
          padding: '14px 18px',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '24px'
        }}>
          {poll.question}
        </div>

        {/* Options */}
        <div>
          {poll.options.map((opt, idx) => (
            <label
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '12px',
                fontWeight: '500',
                transition: 'all 0.2s',
                border: selected === idx ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                backgroundColor: selected === idx ? '#f5f3ff' : '#f9fafb',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="option"
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                style={{ display: 'none' }}
              />
              <div style={{
                backgroundColor: selected === idx ? '#8b5cf6' : '#d1d5db',
                color: 'white',
                fontWeight: 'bold',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                textAlign: 'center',
                lineHeight: '24px',
                marginRight: '12px',
                fontSize: '13px',
              }}>
                {idx + 1}
              </div>
              <span>{opt.text}</span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            style={{
              background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '20px',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              opacity: selected === null ? 0.6 : 1,
              cursor: selected === null ? 'not-allowed' : 'pointer',
            }}
          >
            Submit
          </button>
        </div>

        {/* Chat Toggle Button */}
        <div
  onClick={() => setShowChat(!showChat)}
  style={{
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#6366f1',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    zIndex: 1000
  }}
>
  {/* ⬇️ The Chat Icon */}
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24">
    <path d="M20 2H4C2.897 2 2 2.897 2 4v13c0 1.103.897 2 2 2h4v3.586L12.293 19H20c1.103 0 2-.897 2-2V4C22 2.897 21.103 2 20 2zM20 17H11.586L8 20.586V17H4V4h16V17z" />
  </svg>
</div>


        {/* ChatBox */}
        {showChat && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '360px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 1001
        }}>
          <ChatBox username={studentName} participants={participants} />
        </div>
      )}
      </div>
    </div>
  );
};

export default StudentPoll;
