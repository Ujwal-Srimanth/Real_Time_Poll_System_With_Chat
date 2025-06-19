import { io } from 'socket.io-client';

// Connect to your backend server
export const socket = io('http://localhost:5000', {
  transports: ['websocket'], // optional: ensures stable connection
});
