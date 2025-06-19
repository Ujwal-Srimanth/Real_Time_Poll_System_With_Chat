import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import StudentPoll from '../Components/StudentPoll';
import PollResults from '../Components/PollResults';

const StudentPage = () => {
  const [name, setName] = useState(sessionStorage.getItem('studentName') || '');
  const [nameInput, setNameInput] = useState('');
  const [poll, setPoll] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [kickedOut, setKickedOut] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [nameError, setNameError] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    socket.emit('getParticipants');
    socket.on('participantList', (list) => setParticipants(list));
    return () => socket.off('participantList');
  }, []);

  useEffect(() => {
    socket.on('pollCreated', (pollData) => {
      const now = Date.now();
      const pollStart = new Date(pollData.timestamp).getTime();
      setPoll(pollData);
      setShowResults(false);
      setIsLate(now > pollStart);
    });

    socket.on('pollClosed', () => setShowResults(true));
    socket.on('pollUpdate', (updatedPoll) => setPoll(updatedPoll));
    socket.on('kickedOut', () => {
      setKickedOut(true);
      sessionStorage.removeItem('studentName');
      setName('');
    });

    return () => {
      socket.off('pollCreated');
      socket.off('pollClosed');
      socket.off('pollUpdate');
      socket.off('kickedOut');
    };
  }, []);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) {
      setNameError('This name is already taken. Please choose another.');
      return;
    }

    sessionStorage.setItem('studentName', trimmed);
    setName(trimmed);
    socket.emit('studentJoined', trimmed);
  };

  // 🔴 Kicked Out Screen
  if (kickedOut) {
    return (
      <div style={centerWrapper}>
        <div style={{ textAlign: 'center' }}>
          <span style={tagStyle}>✦ Intervue Poll</span>
          <div style={kickedCircle}>🚫</div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#dc2626' }}>You’ve been kicked out!</h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '8px' }}>
            The teacher has removed you from the session. Try joining again later.
          </p>
        </div>
      </div>
    );
  }

  // 🧍 Name Entry Screen
  if (!name) {
    return (
      <div style={centerWrapper}>
        <div style={cardStyle}>
          <span style={tagStyle}>✦ Intervue Poll</span>
          <h2 style={headingStyle}>Let’s <span style={{ fontWeight: 'bold' }}>Get Started</span></h2>
          <p style={descriptionStyle}>
            Enter your name to participate in live polls and compare responses with your classmates.
          </p>

          <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', textAlign: 'left' }}>Enter your Name</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setNameError('');
            }}
            placeholder="Your Name"
            style={inputStyle}
          />

          {nameError && <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{nameError}</p>}

          <button
            onClick={handleNameSubmit}
            disabled={!nameInput.trim()}
            style={{
              ...continueButton,
              backgroundColor: nameInput.trim() ? '#6366f1' : '#d1d5db',
              cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // 🕒 Waiting for Poll
  if (!poll) {
    return (
      <div style={centerWrapper}>
        <div style={{ textAlign: 'center' }}>
          <span style={tagStyle}>✦ Intervue Poll</span>
          <div style={spinner} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px' }}>
            Wait for the teacher to ask questions..
          </h2>
        </div>
      </div>
    );
  }

  // 🕓 Late Joiner
  if (isLate) {
    return (
      <div style={centerWrapper}>
        <div style={{ textAlign: 'center' }}>
          <span style={tagStyle}>✦ Intervue Poll</span>
          <div style={spinner} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px' }}>
            ⏳ You joined late. Please wait for the next question.
          </h2>
        </div>
      </div>
    );
  }

  // 📊 Poll In Progress / Results
  return (
    <div style={{ padding: '40px 20px' }}>
      {showResults ? (
        <PollResults poll={poll} username={name} />
      ) : (
        <StudentPoll poll={poll} studentName={name} onAnswer={() => setShowResults(true)} />
      )}
    </div>
  );
};

// Styles
const centerWrapper = {
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 20px',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
};

const tagStyle = {
  backgroundColor: '#6366f1',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '16px',
  display: 'inline-block',
};

const headingStyle = {
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '10px',
};

const descriptionStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '24px',
  lineHeight: '1.6',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '16px',
  marginTop: '8px',
};

const continueButton = {
  padding: '12px 28px',
  border: 'none',
  borderRadius: '999px',
  color: 'white',
  fontSize: '16px',
  fontWeight: 600,
  width: '100%',
};

const spinner = {
  width: '32px',
  height: '32px',
  border: '4px solid #8b5cf6',
  borderTop: '4px solid transparent',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '20px auto 0',
};

const kickedCircle = {
  fontSize: '38px',
  color: '#dc2626',
  marginBottom: '16px',
  lineHeight: 1,
};

export default StudentPage;
