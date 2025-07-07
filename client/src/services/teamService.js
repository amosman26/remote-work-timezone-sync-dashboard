import api from './api.js'

export const teamService = {
  // Get all teams
  async getAllTeams() {
    const response = await api.get('/teams')
    return response.data
  },

  // Get specific team
  async getTeam(teamId) {
    const response = await api.get(`/teams/${teamId}`)
    return response.data
  },

  // Add team member
  async addTeamMember(teamId, memberData) {
    const response = await api.post(`/teams/${teamId}/members`, memberData)
    return response.data
  },

  // Update team member
  async updateTeamMember(teamId, memberId, memberData) {
    const response = await api.put(`/teams/${teamId}/members/${memberId}`, memberData)
    return response.data
  },

  // Remove team member
  async removeTeamMember(teamId, memberId) {
    await api.delete(`/teams/${teamId}/members/${memberId}`)
  }
}

export const timezoneService = {
  // Get timezone data
  async getTimezone(timezone) {
    const response = await api.get(`/timezone/${timezone}`)
    return response.data
  },

  // Get multiple timezones
  async getBulkTimezones(timezones) {
    const response = await api.post('/timezone/bulk', { timezones })
    return response.data
  },

  // Get timezone from IP
  async getTimezoneFromIP(ip) {
    const response = await api.get(`/timezone/ip/${ip}`)
    return response.data
  }
}

export const meetingService = {
  // Get meeting suggestions
  async getMeetingSuggestions(members, duration = 60, preferredDays = []) {
    const response = await api.post('/meetings/suggest', {
      members,
      duration,
      preferred_days: preferredDays
    })
    return response.data
  },

  // Schedule a meeting
  async scheduleMeeting(meetingData) {
    const response = await api.post('/meetings/schedule', meetingData)
    return response.data
  },

  // Check meeting conflicts
  async checkMeetingConflicts(day, hour, duration, members) {
    const response = await api.post('/meetings/conflicts', {
      day,
      hour,
      duration,
      members
    })
    return response.data
  }
}
