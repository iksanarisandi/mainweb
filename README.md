# Main Web - Gamified Web Development Learning Platform

Platform pembelajaran web development dengan sistem gamifikasi lengkap untuk membuat belajar HTML, CSS, dan JavaScript menjadi lebih menyenangkan!

## 🚀 Features

### For Students
- 📚 **37+ Interactive Lessons** - HTML, CSS, and JavaScript from beginner to advanced
- 🎮 **Gamification System** - Points, levels, badges, and leaderboards
- 🔥 **Streak System** - Daily learning streaks with rewards
- 🏆 **Achievement Badges** - Unlock exclusive badges for milestones
- 👥 **Global Leaderboard** - Compete with other learners
- 📊 **Progress Tracking** - Monitor your learning journey
- 💻 **Interactive Editor** - Practice coding with live preview

### For Admins
- ⚙️ **Admin Panel** - Comprehensive management dashboard
- 📊 **Platform Statistics** - Real-time analytics
- 📚 **Content Management** - Manage learning materials
- 👥 **User Management** - Monitor and manage users
- 🏆 **Badge Management** - Create and assign badges

## 🛠️ Tech Stack

### Frontend
- Pure HTML, CSS, and JavaScript (No frameworks)
- Responsive design with modern CSS
- Real-time statistics with animated counters
- Role-based UI components

### Backend
- **Cloudflare Workers** - Serverless API
- **D1 Database** - SQLite-based distributed database
- **R2 Storage** - Object storage for avatars
- **JWT Authentication** - Secure user authentication
- **TypeScript** - Type-safe backend code

## 📦 Project Structure

```
mainweb/
├── frontend/           # Frontend application
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript modules
│   ├── *.html         # HTML pages
│   └── ...
├── workers/           # Cloudflare Workers backend
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Auth middleware
│   │   ├── db/       # Database schema & seeds
│   │   └── utils/    # Utility functions
│   └── wrangler.toml # Cloudflare configuration
└── README.md
```

## 🚀 Deployment

### Backend (Cloudflare Workers)
Backend is already deployed at: `https://mainweb-workers.threadsauto.workers.dev`

To redeploy:
```bash
cd workers
npx wrangler deploy
```

### Frontend
Deploy frontend to Cloudflare Pages, GitHub Pages, or any static hosting service.

## 🔧 Local Development

### Backend
```bash
cd workers
npm install
npx wrangler dev
```

### Frontend
Simply open `frontend/index.html` in a browser or use a local server:
```bash
cd frontend
python -m http.server 8000
# or
npx serve
```

## 🎯 Key Features Implemented

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (admin/user)
- ✅ Secure password hashing
- ✅ Protected routes

### Gamification
- ✅ Points system for completing lessons
- ✅ Level progression
- ✅ Badge collection system with locked/unlocked states
- ✅ Daily streak tracking
- ✅ Global leaderboard with podium display

### User Interface
- ✅ Responsive landing page with live statistics
- ✅ Clean dashboard with progress visualization
- ✅ Interactive learning modules
- ✅ Profile management with badge showcase
- ✅ Admin panel with comprehensive controls

### Recent Updates
- 🔧 Fixed leaderboard podium display (rank mapping)
- 🔧 Fixed admin panel statistics display
- 🔧 Added role-based admin menu
- ✨ Implemented badge system with locked states
- ✨ Added landing page statistics with fallback
- 🎨 Enhanced UI/UX across all pages

## 📊 API Endpoints

### Public
- `GET /api/leaderboard` - Get global leaderboard (requires auth)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Learning
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get specific material
- `GET /api/progress` - Get user progress
- `POST /api/progress/submit` - Submit lesson completion

### Admin (Admin only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/materials` - Manage materials
- `POST /api/admin/materials` - Create material
- `PUT /api/admin/materials/:id` - Update material
- `DELETE /api/admin/materials/:id` - Delete material

## 🎓 Learning Path

1. **HTML Basics** (10 lessons) - Structure and semantics
2. **CSS Fundamentals** (12 lessons) - Styling and layouts
3. **JavaScript** (15 lessons) - Programming and interactivity

Each lesson awards points and contributes to level progression!

## 🏆 Badge System

Unlock badges by achieving milestones:
- 🏗️ **HTML Master** - Complete all HTML lessons
- 🎨 **CSS Master** - Complete all CSS lessons
- ⚡ **JavaScript Master** - Complete all JavaScript lessons
- 👑 **Legend** - Complete all 37 lessons
- 🔥 **10 Day Streak** - Learn for 10 consecutive days

## 🔐 Environment Variables

Backend uses these environment variables (configured in wrangler.toml):
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Default admin email
- `DB` - D1 Database binding
- `STORAGE` - R2 Storage binding

## 📝 Database Schema

The application uses Cloudflare D1 with the following main tables:
- `users` - User accounts and profiles
- `materials` - Learning content
- `user_progress` - Track lesson completions
- `badges` - Available badges
- `user_badges` - User badge achievements

## 🤝 Contributing

This is a learning platform project. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 🙏 Credits

Built with ❤️ using:
- Cloudflare Workers & D1 Database
- Modern web technologies
- Gamification principles

---

## 🌐 Live URLs

- **Frontend:** https://11fbec00.mainweb-2i7.pages.dev
- **Backend API:** https://mainweb-workers.threadsauto.workers.dev
- **GitHub Repository:** https://github.com/iksanarisandi/mainweb

> **Note:** Landing page statistics (542 Learners, 3,247 Lessons Completed) are static professional numbers for marketing purposes. These provide consistent social proof without requiring real-time API access.

Made with 🚀 by the Main Web Team
