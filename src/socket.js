import { io } from 'socket.io-client';

// Connect to your backend server
export const socket = io('https://real-time-poll-system-with-chat-1.onrender.com', {
  transports: ['websocket'], // optional: ensures stable connection
});
