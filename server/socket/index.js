const connectedStudents = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 A client connected:', socket.id);

    // 🧍 Student joins
    socket.on('studentJoined', (studentName) => {
      connectedStudents.set(socket.id, studentName);
      console.log('✅ Student registered:', studentName);
    });

    socket.on('getParticipants', () => {
        socket.emit('participantList', Array.from(connectedStudents.values()));
    });


    // 📤 Teacher creates a new poll
    socket.on('newPoll', (pollData) => {
      socket.broadcast.emit('pollCreated', pollData);
      console.log('📢 Poll broadcasted:', pollData);

    });


    // 🛑 Teacher manually closes the poll
    socket.on('closePoll', (pollId) => {
      io.emit('pollClosed', pollId);
      console.log('❌ Poll closed:', pollId);
    });

    socket.on('kickStudent', (studentName) => {
        for (const [id, name] of connectedStudents.entries()) {
          if (name === studentName) {
            io.to(id).emit('kickedOut');
            connectedStudents.delete(id);
            break;
          }
        }
        socket.emit('participantList', Array.from(connectedStudents.values()));
        
      });
      

    // 🔌 Handle disconnection
    socket.on('disconnect', () => {
      const name = connectedStudents.get(socket.id);
      console.log('🔴 Disconnected:', name || socket.id);
      connectedStudents.delete(socket.id);
    });
  });

  io.connectedStudents = connectedStudents; // ✅ Expose for use in controllers
};
