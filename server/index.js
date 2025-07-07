const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Routes
app.use('/api/teams', require('./routes/teams'));
app.use('/api/timezone', require('./routes/timezone'));
app.use('/api/meetings', require('./routes/meetings'));

// Socket.io connection handling
<<<<<<< HEAD
let connectedUsers = new Map();
let teamRooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send connection confirmation
  socket.emit('connection-confirmed', {
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // Join team room
  socket.on('join-team', (data) => {
    const { teamId, userId, userName } = data;
    socket.join(`team-${teamId}`);
    
    // Store user info
    connectedUsers.set(socket.id, {
      userId,
      userName,
      teamId,
      joinedAt: new Date().toISOString()
    });
    
    // Update team room
    if (!teamRooms.has(teamId)) {
      teamRooms.set(teamId, new Set());
    }
    teamRooms.get(teamId).add(socket.id);
    
    console.log(`Client ${socket.id} (${userName}) joined team ${teamId}`);
    
    // Notify other team members
    socket.to(`team-${teamId}`).emit('member-joined', {
      userId,
      userName,
      timestamp: new Date().toISOString()
    });
    
    // Send current team status
    const teamMembers = Array.from(teamRooms.get(teamId) || [])
      .map(socketId => connectedUsers.get(socketId))
      .filter(Boolean);
      
    socket.emit('team-status', {
      teamId,
      connectedMembers: teamMembers,
      totalConnected: teamMembers.length
    });
  });

  // Handle member status updates
  socket.on('member-status-update', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`Status update from ${user.userName}: ${data.status}`);
      socket.to(`team-${user.teamId}`).emit('member-status-changed', {
        userId: user.userId,
        userName: user.userName,
        status: data.status,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle real-time location updates
  socket.on('location-update', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`Location update from ${user.userName}`);
      socket.to(`team-${user.teamId}`).emit('member-location-updated', {
        userId: user.userId,
        userName: user.userName,
        location: data.location,
        coordinates: data.coordinates,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle meeting notifications
  socket.on('meeting-scheduled', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`Meeting scheduled by ${user.userName}: ${data.title}`);
      socket.to(`team-${user.teamId}`).emit('meeting-notification', {
        type: 'scheduled',
        meeting: data,
        organizer: user.userName,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle typing indicators for meetings
  socket.on('typing-meeting', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.to(`team-${user.teamId}`).emit('member-typing', {
        userId: user.userId,
        userName: user.userName,
        isTyping: data.isTyping,
        context: 'meeting-scheduler'
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`Client disconnected: ${user.userName} (${socket.id})`);
      
      // Remove from team room
      if (teamRooms.has(user.teamId)) {
        teamRooms.get(user.teamId).delete(socket.id);
        
        // Notify team members
        socket.to(`team-${user.teamId}`).emit('member-left', {
          userId: user.userId,
          userName: user.userName,
          timestamp: new Date().toISOString()
        });
        
        // Clean up empty team rooms
        if (teamRooms.get(user.teamId).size === 0) {
          teamRooms.delete(user.teamId);
        }
      }
      
      // Remove user from connected users
      connectedUsers.delete(socket.id);
    } else {
      console.log('Client disconnected:', socket.id);
    }
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
=======
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-team', (teamId) => {
    socket.join(teamId);
    console.log(`Client ${socket.id} joined team ${teamId}`);
  });

  socket.on('member-update', (data) => {
    socket.to(data.teamId).emit('member-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
>>>>>>> feature/project-setup
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

<<<<<<< HEAD
// Real-time statistics endpoint
app.get('/api/realtime/stats', (req, res) => {
  const stats = {
    totalConnected: connectedUsers.size,
    activeTeams: teamRooms.size,
    connectionsByTeam: {},
    timestamp: new Date().toISOString()
  };

  // Calculate connections by team
  for (const [teamId, sockets] of teamRooms.entries()) {
    stats.connectionsByTeam[teamId] = sockets.size;
  }

  res.json(stats);
});

// Get connected users for a specific team
app.get('/api/realtime/team/:teamId/users', (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const teamSockets = teamRooms.get(teamId) || new Set();
  
  const teamUsers = Array.from(teamSockets)
    .map(socketId => connectedUsers.get(socketId))
    .filter(Boolean);

  res.json({
    teamId,
    connectedUsers: teamUsers,
    count: teamUsers.length,
    timestamp: new Date().toISOString()
  });
});

=======
>>>>>>> feature/project-setup
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});
