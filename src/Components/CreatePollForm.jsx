import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPoll } from '../Redux/pollSlice';
import { socket } from '../socket';
import PollResults from '../Components/PollResults';
import ChatBox from '../Components/ChatBox';

const CreatePollForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.poll);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', correctAnswer: false },
    { text: '', correctAnswer: false },
  ]);
  const [durationChoice, setDurationChoice] = useState('60');
  const [customDuration, setCustomDuration] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [pollData, setPollData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    socket.emit('getParticipants');
    socket.on('participantList', (list) => setParticipants(list));
    socket.on('pollCreated', (poll) => {
      setPollData(poll);
      setShowResults(true);
    });
    socket.on('pollUpdate', (updatedPoll) => {
      setPollData(updatedPoll);
      setShowResults(true);
    });
    return () => {
      socket.off('participantList');
      socket.off('pollCreated');
      socket.off('pollUpdate');
    };
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    if (field === 'correctAnswer') {
      updated[index].correctAnswer = value === 'true';
    } else {
      updated[index][field] = value;
    }
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: '', correctAnswer: false }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedOptions = options
      .filter(opt => opt.text.trim() !== '')
      .map(opt => ({ text: opt.text.trim(), correctAnswer: opt.correctAnswer }));

    const duration = durationChoice === 'other'
      ? parseInt(customDuration)
      : parseInt(durationChoice);

    const correctCount = cleanedOptions.filter(opt => opt.correctAnswer).length;
    const uniqueTexts = new Set(cleanedOptions.map(opt => opt.text.toLowerCase()));

    if (!question.trim() || cleanedOptions.length < 2 || !duration) {
      alert('Please complete all required fields.');
      return;
    }

    if (uniqueTexts.size !== cleanedOptions.length) {
      alert('Option texts must be unique.');
      return;
    }

    if (correctCount !== 1) {
      alert('Exactly one option must be marked as correct.');
      return;
    }

    const resultAction = await dispatch(
      createPoll({ question, options: cleanedOptions, duration })
    );

    if (createPoll.fulfilled.match(resultAction)) {
      const newPoll = resultAction.payload;
      socket.emit('newPoll', newPoll);
      setPollData(newPoll);
      setShowResults(true);
    }
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setOptions([
      { text: '', correctAnswer: false },
      { text: '', correctAnswer: false },
    ]);
    setDurationChoice('60');
    setCustomDuration('');
    setPollData(null);
    setShowResults(false);
  };

  return (
    <div style={outerContainerStyle}>
      <div style={innerContainerStyle}>

        {!showResults ? (
          <>
          <span style={badgeStyle}>✦ Intervue Poll</span>
        <h2 style={titleStyle}>Let’s <span style={{ fontWeight: '800' }}>Get Started</span></h2>
        <p style={descStyle}>
          You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
        </p>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Question & Duration */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>Enter your question</label>
              <select
                value={durationChoice}
                onChange={(e) => setDurationChoice(e.target.value)}
                style={dropdownStyle}
              >
                <option value="30">30 seconds</option>
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
                <option value="other">Custom</option>
              </select>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              maxLength={100}
              required
              style={{ ...inputStyle, height: '100px' }}
            />
            <div style={charCountStyle}>
              {question.length}/100
            </div>

            {durationChoice === 'other' && (
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="Enter seconds"
                style={inputStyle}
                required
              />
            )}

            {/* Options */}
            <div style={optionHeaderRowStyle}>
              <div style={{ flex: 2 }}>Edit Options</div>
              <div style={{ flex: 1 }}>Is it Correct?</div>
            </div>

            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div style={circleNumberStyle}>{idx + 1}</div>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  style={{ ...inputStyle, flex: 2, marginRight: '10px' }}
                  required
                />
                <div style={{ flex: 1 }}>
                  <label style={{ marginRight: '12px' }}>
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      value="true"
                      checked={opt.correctAnswer === true}
                      onChange={() => {
                        const updated = options.map((o, i) => ({
                          ...o,
                          correctAnswer: i === idx
                        }));
                        setOptions(updated);
                      }}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      value="false"
                      checked={opt.correctAnswer === false}
                      onChange={() => handleOptionChange(idx, 'correctAnswer', 'false')}
                    /> No
                  </label>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
              <button type="button" onClick={addOption} style={addBtnStyle}>+ Add More Option</button>
            </div>

            {/* Horizontal Line */}
            <hr style={{ marginTop: '40px', marginBottom: '20px', borderTop: '1px solid #ccc' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loading} style={submitBtnStyle}>
                {loading ? 'Creating...' : 'Ask Question'}
              </button>
            </div>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>
          </>
        ) : (
          <PollResults poll={pollData} username="Teacher" handleNewQuestion={handleNewQuestion} />
        )}
      </div>

      {/* Chat Toggle Button */}
      <div
        onClick={() => setShowChat(!showChat)}
        style={chatButtonStyle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24">
          <path d="M20 2H4C2.897 2 2 2.897 2 4v13c0 1.103.897 2 2 2h4v3.586L12.293 19H20c1.103 0 2-.897 2-2V4C22 2.897 21.103 2 20 2zM20 17H11.586L8 20.586V17H4V4h16V17z" />
        </svg>
      </div>

      {/* Chat Window */}
      {showChat && (
        <div style={chatWindowStyle}>
          <ChatBox username="Teacher" participants={participants} onKick={(name) => {
            socket.emit('kickStudent', name);
            alert(`${name} has been kicked out.`);
          }} />
        </div>
      )}
    </div>
  );
};

// Layout styles
const outerContainerStyle = {
  minHeight: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
  justifyContent: 'center',
  padding: '40px 16px',
};

const innerContainerStyle = {
  width: '100%',
  maxWidth: '900px',
  fontSize: '17px',
};

const badgeStyle = {
  background: '#8b5cf6',
  color: 'white',
  padding: '5px 12px',
  fontSize: '12px',
  borderRadius: '12px',
  display: 'inline-block',
  marginBottom: '12px'
};

const titleStyle = {
  fontSize: '30px',
  fontWeight: '600',
  marginTop: '12px',
};

const descStyle = {
  fontSize: '15px',
  color: '#666',
  marginBottom: '24px',
};

const labelStyle = {
  fontWeight: '600',
  display: 'block',
  marginTop: '20px',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '16px',
};

const dropdownStyle = {
  padding: '10px',
  borderRadius: '8px',
  fontSize: '15px',
  border: '1px solid #ccc',
};

const charCountStyle = {
  textAlign: 'right',
  color: '#888',
  marginTop: '-12px',
  marginBottom: '16px',
};

const optionHeaderRowStyle = {
  display: 'flex',
  marginTop: '24px',
  fontWeight: '600',
};

const circleNumberStyle = {
  backgroundColor: '#ede9fe',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  textAlign: 'center',
  lineHeight: '24px',
  marginRight: '10px',
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#7c3aed'
};

const submitBtnStyle = {
  padding: '12px 32px',
  backgroundColor: '#8b5cf6',
  color: 'white',
  fontWeight: '600',
  fontSize: '16px',
  borderRadius: '24px',
  border: 'none',
  cursor: 'pointer',
};

const addBtnStyle = {
  background: 'transparent',
  border: '1px solid #8b5cf6',
  color: '#8b5cf6',
  borderRadius: '6px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '15px'
};

const chatButtonStyle = {
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
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  zIndex: 1000
};

const chatWindowStyle = {
  position: 'fixed',
  bottom: '90px',
  right: '24px',
  width: '360px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  zIndex: 1001
};

export default CreatePollForm;
