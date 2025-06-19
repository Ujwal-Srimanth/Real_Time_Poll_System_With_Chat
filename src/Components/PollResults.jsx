import React, { useState } from 'react';
import ChatBox from './ChatBox';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const PollResults = ({ poll, username, handleNewQuestion }) => {
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  // Fetch participants list
  React.useEffect(() => {
    socket.emit('getParticipants');
    socket.on('participantList', (list) => setParticipants(list));
    return () => socket.off('participantList');
  }, []);

  const userResponse = poll.responses.find((r) => r.studentName === username)?.answer;
  const counts = poll.options.map(
    (opt) => poll.responses.filter((r) => r.answer === opt.text).length
  );
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>

        {/* Poll History (Teacher Only) */}
        {username === 'Teacher' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button
              onClick={() => navigate('/history')}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 20px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📊 View Poll History
            </button>
          </div>
        )}

        {/* Question Text */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#111827'
        }}>
          Question
        </h3>

        <p style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '32px',
          color: '#1f2937'
        }}>
          {poll.question}
        </p>

        {/* Option Bars */}
        {poll.options.map((opt, idx) => {
          const voteCount = counts[idx];
          const percentage = ((voteCount / (total || 1)) * 100).toFixed(1);
          const isCorrect = opt.correctAnswer;
          const isUserSelected = userResponse === opt.text;
          const fillColor = isCorrect ? '#bbf7d0' : '#fecaca';  // green/red background
          const barColor = isCorrect ? '#10b981' : '#ef4444';   // green/red fill

          return (
            <div key={idx} style={{
              position: 'relative',
              marginBottom: '16px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: isUserSelected && username !== 'Teacher'
                ? '2px solid #6366f1'
                : '1px solid #e5e7eb',
              height: '50px',
              backgroundColor: fillColor,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#000',
              boxShadow: isUserSelected && username !== 'Teacher'
                ? '0 0 0 2px rgba(99, 102, 241, 0.2)'
                : 'none'
            }}>
              {/* Fill bar */}
              <div style={{
                backgroundColor: barColor,
                width: `${percentage}%`,
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                opacity: 0.4,
                transition: 'width 0.3s ease'
              }} />
              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <span>{opt.text}</span>
                <span>{percentage}%</span>
              </div>
            </div>
          );
        })}

        {/* Total Responses */}
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          marginTop: '20px',
          color: '#374151'
        }}>
          Total responses: <strong>{total}</strong>
        </p>

        {/* Ask New Question (Teacher Only) */}
        {username === 'Teacher' && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={handleNewQuestion}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 24px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              🆕 Ask New Question
            </button>
          </div>
        )}

        {/* Wait Message (Student Only) */}
        {username !== 'Teacher' && (
          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            ⏳ Please wait for the teacher to ask a new question...
          </p>
        )}
      </div>

      {/* Floating Chat Button */}
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M20 2H4C2.897 2 2 2.897 2 4v13c0 1.103.897 2 2 2h4v3.586L12.293 19H20c1.103 0 2-.897 2-2V4C22 2.897 21.103 2 20 2zM20 17H11.586L8 20.586V17H4V4h16V17z" />
        </svg>
      </div>

      {/* Chat Window */}
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
          <ChatBox username={username} participants={participants} />
        </div>
      )}
    </div>
  );
};

export default PollResults;
