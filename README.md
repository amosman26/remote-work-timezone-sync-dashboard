# Remote Work Timezone Sync Dashboard

A modern web application that helps remote teams visualize global team member locations, view their local times, and suggest best meeting overlaps.

## 🚀 Features

- **Interactive Team Map**: Visualize team members' locations on a world map
- **Live Time Zones**: Real-time display of each team member's local time
- **Meeting Scheduler**: Find optimal meeting times across different time zones
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Real-time Updates**: Socket.io powered live updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** with Composition API
- **Tailwind CSS** for styling
- **Leaflet** for interactive maps
- **Socket.io Client** for real-time communication
- **Axios** for API requests
- **Vite** for fast development and building

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **CORS** for cross-origin requests
- **World Time API** integration
- **GeoIP Lookup** support

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd remote-work-timezone-sync-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment files
   cp .env.example .env
   cd client
   cp .env.example .env
   cd ..
   ```

4. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev

   # Or start them separately:
   # Backend (port 3000)
   npm run server:dev

   # Frontend (port 5173)
   npm run client:dev
   ```

## 🎯 Usage

1. **Dashboard**: View team overview, member locations, and live time zones
2. **Teams**: Manage team members, add new members, update information
3. **Meetings**: Find optimal meeting times and schedule meetings across time zones

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                # Start both frontend and backend
npm run server:dev         # Start backend only
npm run client:dev         # Start frontend only

# Production
npm run build             # Build frontend for production
npm run server:start      # Start backend in production mode

# Utilities
npm run install:all       # Install all dependencies
```

### API Endpoints

- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get specific team
- `POST /api/teams/:id/members` - Add team member
- `PUT /api/teams/:teamId/members/:memberId` - Update team member
- `DELETE /api/teams/:teamId/members/:memberId` - Remove team member
- `GET /api/timezone/:timezone` - Get timezone data
- `POST /api/timezone/bulk` - Get multiple timezone data
- `POST /api/meetings/suggest` - Get meeting suggestions
- `POST /api/meetings/schedule` - Schedule a meeting

## 🎨 Customization

### Themes
The application supports dark and light themes that automatically adapt to system preferences. Toggle manually using the theme switch in the header.

### Adding Team Members
Use the Teams page to add new members with:
- Name and role
- Location and timezone
- Geographic coordinates for map placement
- Profile avatar URL
- Online status

## 🔄 Real-time Features

The application uses Socket.io for real-time updates:
- Live team member status changes
- Meeting notifications
- Connection status indicators

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🛣 Roadmap

- [ ] Integration with calendar systems (Google Calendar, Outlook)
- [ ] Advanced meeting conflict detection
- [ ] Team productivity analytics
- [ ] Custom notification settings
- [ ] Export meeting schedules
- [ ] Multi-team support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Leaflet for the interactive mapping library
- OpenStreetMap for map tiles
- World Time API for timezone data
