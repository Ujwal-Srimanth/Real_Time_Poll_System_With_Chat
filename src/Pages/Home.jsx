import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        {/* Logo Tag */}
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#6366f1',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        >
          ✨ Intervue Poll
        </span>

        {/* Main Heading */}
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
          Welcome to the <span style={{ color: '#1e1b4b' }}>Live Polling System</span>
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Please select the role that best describes you to begin using the live polling system
        </p>

        {/* Role Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
          {/* Student Card */}
          <div
            onClick={() => setRole('student')}
            style={{
              border: role === 'student' ? '2px solid #6366f1' : '1px solid #e5e7eb',
              padding: '20px',
              borderRadius: '10px',
              cursor: 'pointer',
              width: '50%',
              backgroundColor: role === 'student' ? '#f0f4ff' : 'white',
              boxShadow: role === 'student' ? '0 2px 8px rgba(99,102,241,0.2)' : '',
              transition: '0.2s',
            }}
          >
            <h3 style={{ fontWeight: '600', marginBottom: '6px' }}>I’m a Student</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Join and answer live questions, view results in real-time.
            </p>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => setRole('teacher')}
            style={{
              border: role === 'teacher' ? '2px solid #6366f1' : '1px solid #e5e7eb',
              padding: '20px',
              borderRadius: '10px',
              cursor: 'pointer',
              width: '50%',
              backgroundColor: role === 'teacher' ? '#f0f4ff' : 'white',
              boxShadow: role === 'teacher' ? '0 2px 8px rgba(99,102,241,0.2)' : '',
              transition: '0.2s',
            }}
          >
            <h3 style={{ fontWeight: '600', marginBottom: '6px' }}>I’m a Teacher</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Create & manage polls, monitor responses in real-time.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (role === 'student') navigate('/student');
            else if (role === 'teacher') navigate('/teacher');
          }}
          disabled={!role}
          style={{
            padding: '12px 28px',
            backgroundColor: role ? '#6366f1' : '#d1d5db',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '999px',
            border: 'none',
            cursor: role ? 'pointer' : 'not-allowed',
            marginTop: '8px',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Home;
