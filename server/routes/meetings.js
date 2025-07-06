const express = require('express');
const router = express.Router();

// Helper function to find meeting time overlaps
function findMeetingOverlaps(members, duration = 60) {
  const timeSlots = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  days.forEach(day => {
    for (let hour = 8; hour <= 18; hour++) {
      const slot = {
        day,
        hour,
        utc_time: null,
        available_members: [],
        total_members: members.length
      };

      members.forEach(member => {
        // Calculate if this time slot falls within working hours for this member
        // This is a simplified calculation - in production you'd use proper timezone conversion
        const memberHour = (hour + getTimezoneOffset(member.timezone)) % 24;
        
        if (memberHour >= 9 && memberHour <= 17) {
          slot.available_members.push({
            id: member.id,
            name: member.name,
            local_time: `${memberHour}:00`,
            timezone: member.timezone
          });
        }
      });

      slot.availability_percentage = (slot.available_members.length / slot.total_members) * 100;
      
      if (slot.available_members.length >= 2) {
        timeSlots.push(slot);
      }
    }
  });

  return timeSlots.sort((a, b) => b.availability_percentage - a.availability_percentage);
}

// Simplified timezone offset calculation (in production, use a proper library)
function getTimezoneOffset(timezone) {
  const offsets = {
    'America/New_York': -5,
    'America/Sao_Paulo': -3,
    'Europe/London': 0,
    'Asia/Tokyo': 9,
    'Asia/Shanghai': 8,
    'Australia/Sydney': 11,
    'America/Los_Angeles': -8,
    'Europe/Berlin': 1
  };
  return offsets[timezone] || 0;
}

// POST /api/meetings/suggest - Get meeting time suggestions
router.post('/suggest', (req, res) => {
  try {
    const { members, duration, preferred_days } = req.body;
    
    if (!Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: 'At least 2 members required' });
    }

    const suggestions = findMeetingOverlaps(members, duration);
    
    res.json({
      suggestions: suggestions.slice(0, 10), // Return top 10 suggestions
      total_slots_found: suggestions.length,
      analysis: {
        best_availability: suggestions[0]?.availability_percentage || 0,
        average_availability: suggestions.reduce((sum, slot) => sum + slot.availability_percentage, 0) / suggestions.length || 0
      }
    });
  } catch (error) {
    console.error('Meeting suggestion error:', error.message);
    res.status(500).json({ error: 'Failed to generate meeting suggestions' });
  }
});

// POST /api/meetings/schedule - Schedule a meeting
router.post('/schedule', (req, res) => {
  try {
    const { title, description, day, hour, duration, attendees, organizer } = req.body;
    
    const meeting = {
      id: Date.now(),
      title,
      description,
      day,
      hour,
      duration,
      attendees,
      organizer,
      created_at: new Date().toISOString(),
      status: 'scheduled'
    };

    // In production, this would be saved to a database
    res.status(201).json(meeting);
  } catch (error) {
    console.error('Meeting scheduling error:', error.message);
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
});

// GET /api/meetings/conflicts - Check for meeting conflicts
router.post('/conflicts', (req, res) => {
  try {
    const { day, hour, duration, members } = req.body;
    
    // Simplified conflict checking
    const conflicts = members.filter(member => {
      const memberHour = (hour + getTimezoneOffset(member.timezone)) % 24;
      return memberHour < 9 || memberHour > 17; // Outside working hours
    });

    res.json({
      has_conflicts: conflicts.length > 0,
      conflicted_members: conflicts,
      recommendation: conflicts.length > 0 ? 'Consider choosing a different time slot' : 'Time slot looks good for all members'
    });
  } catch (error) {
    console.error('Conflict checking error:', error.message);
    res.status(500).json({ error: 'Failed to check conflicts' });
  }
});

module.exports = router;
