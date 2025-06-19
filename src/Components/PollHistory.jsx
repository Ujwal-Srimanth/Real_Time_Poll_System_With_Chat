import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PollHistory = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://real-time-poll-system-with-chat-1.onrender.com/api/polls/history')
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '40px 60px', maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      {/* Cross Icon */}
      <div
        onClick={() => navigate('/teacher')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          fontWeight: 'bold'
        }}
        title="Go back"
      >
        ✖
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        View <span style={{ fontWeight: '800' }}>Poll History</span>
      </h2>

      {history.length === 0 ? (
        <p>No previous polls found.</p>
      ) : (
        history.map((poll, index) => {
          const counts = poll.options.map(
            opt => poll.responses.filter(r => r.answer === opt.text).length
          );
          const total = counts.reduce((a, b) => a + b, 0);

          return (
            <div key={index} style={{ marginBottom: '40px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Question {index + 1}</h4>
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: 'white'
              }}>
                <div style={{
                  background: '#4b5563',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  {poll.question}
                </div>

                {poll.options.map((opt, idx) => {
                  const percentage = ((counts[idx] / (total || 1)) * 100).toFixed(0);
                  return (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: '#f3f4f6',
                        fontWeight: 500
                      }}>
                        <span>{opt.text}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div style={{
                        backgroundColor: '#e5e7eb',
                        height: '6px',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          backgroundColor: '#6366f1',
                          height: '100%'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PollHistory;
