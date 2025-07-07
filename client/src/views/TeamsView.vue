<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">
          Manage your team members and their locations
        </p>
      </div>
      <button
        @click="showAddMemberModal = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Member
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Loading teams...</p>
    </div>

    <!-- Teams List -->
    <div v-else class="space-y-6">
      <div v-for="team in teams" :key="team.id" class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ team.name }}
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ team.members.length }} members
          </span>
        </div>

        <!-- Team Members Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="member in team.members"
            :key="member.id"
            class="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div
                  :class="[
                    'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-dark-700',
                    `status-${member.status}`
                  ]"
                ></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ member.name }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ member.role }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ member.location }}
                </p>
              </div>
            </div>

            <div class="mt-3 flex justify-between items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ member.timezone }}
              </span>
              <div class="flex space-x-1">
                <button
                  @click="editMember(team.id, member)"
                  class="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Edit member"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="removeMember(team.id, member.id)"
                  class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Remove member"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <MemberModal
      v-if="showAddMemberModal || editingMember"
      :member="editingMember"
      @close="closeModal"
      @save="saveMember"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { teamService } from '../services/teamService.js'
import MemberModal from '../components/MemberModal.vue'

const teams = ref([])
const loading = ref(true)
const showAddMemberModal = ref(false)
const editingMember = ref(null)
const editingTeamId = ref(null)

const fetchTeams = async () => {
  try {
    loading.value = true
    teams.value = await teamService.getAllTeams()
  } catch (error) {
    console.error('Error fetching teams:', error)
  } finally {
    loading.value = false
  }
}

const editMember = (teamId, member) => {
  editingMember.value = { ...member }
  editingTeamId.value = teamId
}

const removeMember = async (teamId, memberId) => {
  if (confirm('Are you sure you want to remove this team member?')) {
    try {
      await teamService.removeTeamMember(teamId, memberId)
      await fetchTeams()
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }
}

const closeModal = () => {
  showAddMemberModal.value = false
  editingMember.value = null
  editingTeamId.value = null
}

const saveMember = async (memberData) => {
  try {
    const teamId = editingTeamId.value || 1 // Default to first team
    
    if (editingMember.value) {
      // Update existing member
      await teamService.updateTeamMember(teamId, editingMember.value.id, memberData)
    } else {
      // Add new member
      await teamService.addTeamMember(teamId, memberData)
    }
    
    await fetchTeams()
    closeModal()
  } catch (error) {
    console.error('Error saving member:', error)
  }
}

onMounted(() => {
  fetchTeams()
})
</script>
