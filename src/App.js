import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './Pages/TeacherDashboard';
import Home from './Pages/Home';
import StudentPage from './Pages/StudentPage';
import PollHistory from './Components/PollHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/history" element={<PollHistory/>}/>
      </Routes>
    </Router>
  );
}

export default App;
