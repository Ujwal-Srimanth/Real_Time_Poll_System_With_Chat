const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const ChatMessage = require('./models/ChatMessage');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // ✅ ensure SSL/TLS is explicitly enabled
  tlsAllowInvalidCertificates: false, // 🔒 for security, unless you're testing
}).then(() => console.log("MongoDB connected"));

app.use(cors());
app.use(express.json());

const createPollRouter = require('./routes/PollRoutes');
app.use('/api/polls', createPollRouter(io)); // 👈 inject io here

const chatRoutes = require('./routes/Char');

app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
   socket.on('chatMessage', async (msg) => {
        const newMsg = new ChatMessage({
          name: msg.name,
          message: msg.message,
          timestamp: new Date() // ✅ Proper timestamp added server-side
        });
        await newMsg.save();
        io.emit('chatMessage', newMsg);  // ✅ Broadcast saved message
      });
});

require('./socket')(io);

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
