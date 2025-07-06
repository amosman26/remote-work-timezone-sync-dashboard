import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.pingInterval = null
    this.eventListeners = new Map()
  }

  connect(userId = null, userName = null) {
    if (this.socket) {
      return this.socket
    }

    console.log('Connecting to Socket.io server...')
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id)
      this.isConnected = true
      this.reconnectAttempts = 0
      this.startPing()
      
      // Emit connection event if user info available
      if (userId && userName) {
        this.socket.emit('user-connected', { userId, userName })
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      this.isConnected = false
      this.stopPing()
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.isConnected = false
      this.reconnectAttempts++
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts')
      this.isConnected = true
      this.reconnectAttempts = 0
    })

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect after maximum attempts')
      this.isConnected = false
    })

    // Handle connection confirmation
    this.socket.on('connection-confirmed', (data) => {
      console.log('Connection confirmed:', data)
    })

    // Handle pong responses
    this.socket.on('pong', (data) => {
      // Connection is healthy
    })

    return this.socket
  }

  disconnect() {
    this.stopPing()
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Ping/Pong for connection health monitoring
  startPing() {
    this.pingInterval = setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.emit('ping')
      }
    }, 30000) // Ping every 30 seconds
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  // Team management
  joinTeam(teamId, userId, userName) {
    if (this.socket) {
      this.socket.emit('join-team', { teamId, userId, userName })
    }
  }

  leaveTeam(teamId) {
    if (this.socket) {
      this.socket.leave(`team-${teamId}`)
    }
  }

  // Member status updates
  updateMemberStatus(status) {
    if (this.socket) {
      this.socket.emit('member-status-update', { status })
    }
  }

  updateLocation(location, coordinates) {
    if (this.socket) {
      this.socket.emit('location-update', { location, coordinates })
    }
  }

  // Meeting management
  scheduleMeeting(meetingData) {
    if (this.socket) {
      this.socket.emit('meeting-scheduled', meetingData)
    }
  }

  sendTypingIndicator(isTyping) {
    if (this.socket) {
      this.socket.emit('typing-meeting', { isTyping })
    }
  }

  // Event listeners
  onMemberJoined(callback) {
    this.addEventListener('member-joined', callback)
  }

  onMemberLeft(callback) {
    this.addEventListener('member-left', callback)
  }

  onMemberStatusChanged(callback) {
    this.addEventListener('member-status-changed', callback)
  }

  onMemberLocationUpdated(callback) {
    this.addEventListener('member-location-updated', callback)
  }

  onMeetingNotification(callback) {
    this.addEventListener('meeting-notification', callback)
  }

  onMemberTyping(callback) {
    this.addEventListener('member-typing', callback)
  }

  onTeamStatus(callback) {
    this.addEventListener('team-status', callback)
  }

  // Generic event listener management
  addEventListener(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
      
      // Store reference for cleanup
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, new Set())
      }
      this.eventListeners.get(event).add(callback)
    }
  }

  removeEventListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
      
      // Remove from stored references
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).delete(callback)
      }
    }
  }

  removeAllEventListeners(event) {
    if (this.socket && this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event)
      callbacks.forEach(callback => {
        this.socket.off(event, callback)
      })
      this.eventListeners.delete(event)
    }
  }

  // Connection status
  getConnectionStatus() {
    return this.isConnected
  }

  getReconnectAttempts() {
    return this.reconnectAttempts
  }

  // Force reconnection
  forceReconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket.connect()
    }
  }
}

export default new SocketService()
