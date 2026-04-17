import api from './api';
import { io } from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.unreadCount = 0;
  }

  initSocket(token, userId, role) {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
      this.fetchUnreadCount();
    });
    
    this.socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });
    
    this.socket.on('new_notification', (notification) => {
      console.log('📢 New notification:', notification);
      this.unreadCount++;
      this.notifyListeners('new', notification);
      this.notifyListeners('count_update', this.unreadCount);
      this.playSound();
    });
    
    this.socket.on('notification_read', (notificationId) => {
      this.notifyListeners('read', notificationId);
    });
    
    this.socket.on('all_notifications_read', () => {
      this.unreadCount = 0;
      this.notifyListeners('count_update', 0);
    });
    
    return this.socket;
  }

  playSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
      
        const beep = new AudioContext();
        const oscillator = beep.createOscillator();
        const gain = beep.createGain();
        oscillator.connect(gain);
        gain.connect(beep.destination);
        oscillator.frequency.value = 880;
        gain.gain.value = 0.2;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          beep.close();
        }, 200);
      });
    } catch (e) {
      console.log('Sound not supported');
    }
  }

  onNotification(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  async fetchNotifications(params = {}) {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async fetchUnreadCount() {
    try {
      const response = await api.get('/notifications/unread/count');
      this.unreadCount = response.data.count;
      this.notifyListeners('count_update', this.unreadCount);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async markAsRead(id) {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      if (response.data.success) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notifyListeners('count_update', this.unreadCount);
      }
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/read/all');
      if (response.data.success) {
        this.unreadCount = 0;
        this.notifyListeners('count_update', 0);
      }
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  async deleteNotification(id) {
    try {
      const response = await api.delete(`/notifications/${id}`);
      if (response.data.success) {
        await this.fetchUnreadCount();
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new NotificationService();