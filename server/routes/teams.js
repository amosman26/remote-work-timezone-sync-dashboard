const express = require('express');
const router = express.Router();

// Sample team data (in production, this would come from a database)
let teams = [
  {
    id: 1,
    name: "Development Team Alpha",
    members: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Frontend Developer",
        location: "New York, USA",
        timezone: "America/New_York",
        coordinates: [40.7128, -74.0060],
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face",
        status: "online"
      },
      {
        id: 2,
        name: "Bob Chen",
        role: "Backend Developer",
        location: "Tokyo, Japan",
        timezone: "Asia/Tokyo",
        coordinates: [35.6762, 139.6503],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        status: "online"
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "DevOps Engineer",
        location: "London, UK",
        timezone: "Europe/London",
        coordinates: [51.5074, -0.1278],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "away"
      },
      {
        id: 4,
        name: "Diana Silva",
        role: "UI/UX Designer",
        location: "São Paulo, Brazil",
        timezone: "America/Sao_Paulo",
        coordinates: [-23.5505, -46.6333],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        status: "online"
      }
    ]
  }
];

// GET /api/teams - Get all teams
router.get('/', (req, res) => {
  res.json(teams);
});

// GET /api/teams/:id - Get specific team
router.get('/:id', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.id));
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

// POST /api/teams/:id/members - Add team member
router.post('/:id/members', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.id));
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const newMember = {
    id: Date.now(),
    ...req.body,
    status: 'online'
  };

  team.members.push(newMember);
  res.status(201).json(newMember);
});

// PUT /api/teams/:teamId/members/:memberId - Update team member
router.put('/:teamId/members/:memberId', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.teamId));
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const memberIndex = team.members.findIndex(m => m.id === parseInt(req.params.memberId));
  if (memberIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  team.members[memberIndex] = { ...team.members[memberIndex], ...req.body };
  res.json(team.members[memberIndex]);
});

// DELETE /api/teams/:teamId/members/:memberId - Remove team member
router.delete('/:teamId/members/:memberId', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.teamId));
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const memberIndex = team.members.findIndex(m => m.id === parseInt(req.params.memberId));
  if (memberIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  team.members.splice(memberIndex, 1);
  res.status(204).send();
});

module.exports = router;
