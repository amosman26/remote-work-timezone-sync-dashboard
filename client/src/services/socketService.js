import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect() {
    if (this.socket) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    })

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id)
      this.isConnected = true
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.isConnected = false
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinTeam(teamId) {
    if (this.socket) {
      this.socket.emit('join-team', teamId)
    }
  }

  updateMember(teamId, memberData) {
    if (this.socket) {
      this.socket.emit('member-update', { teamId, ...memberData })
    }
  }

  onMemberUpdate(callback) {
    if (this.socket) {
      this.socket.on('member-updated', callback)
    }
  }

  offMemberUpdate() {
    if (this.socket) {
      this.socket.off('member-updated')
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

export default new SocketService()
