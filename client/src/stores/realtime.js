import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socketService from '../services/socketService.js'

export const useRealtimeStore = defineStore('realtime', () => {
  // State
  const isConnected = ref(false)
  const connectionStatus = ref('disconnected')
  const connectedMembers = ref(new Map())
  const notifications = ref([])
  const typingUsers = ref(new Set())
  const currentUser = ref(null)
  const teamStats = ref({
    totalConnected: 0,
    activeTeams: 0,
    connectionsByTeam: {}
  })

  // Getters
  const onlineMembersCount = computed(() => connectedMembers.value.size)
  const hasNotifications = computed(() => notifications.value.length > 0)
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  // Actions
  const connect = (userId, userName) => {
    currentUser.value = { userId, userName }
    socketService.connect(userId, userName)
    setupEventListeners()
  }

  const disconnect = () => {
    socketService.disconnect()
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    connectedMembers.value.clear()
    typingUsers.value.clear()
  }

  const joinTeam = (teamId) => {
    if (currentUser.value) {
      socketService.joinTeam(teamId, currentUser.value.userId, currentUser.value.userName)
    }
  }

  const updateStatus = (status) => {
    socketService.updateMemberStatus(status)
  }

  const updateLocation = (location, coordinates) => {
    socketService.updateLocation(location, coordinates)
  }

  const scheduleMeeting = (meetingData) => {
    socketService.scheduleMeeting(meetingData)
  }

  const sendTypingIndicator = (isTyping) => {
    socketService.sendTypingIndicator(isTyping)
  }

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    })

    // Limit notifications to last 50
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  const markNotificationAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const setupEventListeners = () => {
    // Connection status
    socketService.socket?.on('connect', () => {
      isConnected.value = true
      connectionStatus.value = 'connected'
    })

    socketService.socket?.on('disconnect', () => {
      isConnected.value = false
      connectionStatus.value = 'disconnected'
    })

    socketService.socket?.on('connect_error', () => {
      connectionStatus.value = 'error'
    })

    socketService.socket?.on('reconnect', () => {
      connectionStatus.value = 'reconnected'
      setTimeout(() => {
        connectionStatus.value = 'connected'
      }, 2000)
    })

    // Member events
    socketService.onMemberJoined((data) => {
      connectedMembers.value.set(data.userId, {
        userId: data.userId,
        userName: data.userName,
        joinedAt: data.timestamp,
        status: 'online'
      })

      addNotification({
        type: 'member-joined',
        title: 'Member Joined',
        message: `${data.userName} joined the team`,
        data
      })
    })

    socketService.onMemberLeft((data) => {
      connectedMembers.value.delete(data.userId)
      typingUsers.value.delete(data.userId)

      addNotification({
        type: 'member-left',
        title: 'Member Left',
        message: `${data.userName} left the team`,
        data
      })
    })

    socketService.onMemberStatusChanged((data) => {
      const member = connectedMembers.value.get(data.userId)
      if (member) {
        member.status = data.status
        member.lastUpdate = data.timestamp
      }

      addNotification({
        type: 'status-change',
        title: 'Status Update',
        message: `${data.userName} is now ${data.status}`,
        data
      })
    })

    socketService.onMemberLocationUpdated((data) => {
      const member = connectedMembers.value.get(data.userId)
      if (member) {
        member.location = data.location
        member.coordinates = data.coordinates
        member.lastUpdate = data.timestamp
      }

      addNotification({
        type: 'location-update',
        title: 'Location Update',
        message: `${data.userName} updated their location to ${data.location}`,
        data
      })
    })

    // Meeting events
    socketService.onMeetingNotification((data) => {
      addNotification({
        type: 'meeting',
        title: `Meeting ${data.type}`,
        message: `${data.organizer} ${data.type} a meeting: ${data.meeting.title}`,
        data
      })
    })

    // Typing indicators
    socketService.onMemberTyping((data) => {
      if (data.isTyping) {
        typingUsers.value.add(data.userId)
      } else {
        typingUsers.value.delete(data.userId)
      }
    })

    // Team status
    socketService.onTeamStatus((data) => {
      // Update connected members
      connectedMembers.value.clear()
      data.connectedMembers.forEach(member => {
        connectedMembers.value.set(member.userId, member)
      })

      teamStats.value = {
        ...teamStats.value,
        totalConnected: data.totalConnected
      }
    })
  }

  return {
    // State
    isConnected,
    connectionStatus,
    connectedMembers,
    notifications,
    typingUsers,
    currentUser,
    teamStats,

    // Getters
    onlineMembersCount,
    hasNotifications,
    unreadNotifications,

    // Actions
    connect,
    disconnect,
    joinTeam,
    updateStatus,
    updateLocation,
    scheduleMeeting,
    sendTypingIndicator,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications
  }
})
