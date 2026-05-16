import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io('https://hostel-management-system-backened-1.onrender.com/api', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('newMessage', (message) => {
     
      toast.success(`New message from ${message.sender.name}`);
    });

    this.socket.on('userTyping', (data) => {
    
      console.log('User typing:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('sendMessage', data);
    }
  }

  sendTyping(data) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }

  markAsRead(data) {
    if (this.socket) {
      this.socket.emit('messageRead', data);
    }
  }
}

export default new SocketService();