# Habbitly 🧠✨

**Habbitly** is a personalized habit-building coach powered by AI. It helps users develop and maintain positive habits through custom goal-setting, adaptive reminders, motivational insights, and progress tracking — all within a fun and interactive interface.

---

## 🚀 Live Demo

👉 [Habbitly Live App](https://habbitly.vercel.app)

---

## 🛠 Tech Stack

**Frontend:** React + JavaScript  
**Backend:** Node.js, Express  
**Database:** PostgreSQL, NeonDB  
**Styling:** SCSS + Tailwind CSS  
**Authentication:** JWT(jsonwebtokens) (Jose library)  
**State Management:** React Context  
**Deployment:** Vercel and Netlify  
**AI/Logic:** Custom logic (AI planning integration in-progress)

---

## Features

### ✅ Core Features

- 📋 Habit Creation & Customization
  Users can set and personalize habits aligned to their own goals like fitness, mindfulness, or productivity.

- ⏰ AI-Driven Reminders & Nudges **(Work In Progress)**
  Adaptive reminders based on user consistency and behavior.

- 📊 Progress Tracking & Analytics **(Work In Progress)**
  Visual feedback for streaks, completions, and goal trends.

- 💬 Positive Reinforcement **(Work In Progress)**
  Custom motivational insights based on performance data.

- 🔧 Dynamic Habit Adjustment Suggestions **(Work In Progress)**
  Personalized recommendations for habit changes or additions.

- 🌈 Animated 3D Background (WebGL)
  Users can toggle immersive 3D animated backgrounds when WebGL is supported.

### ✨ Bonus Features

- 📱 Responsive mobile/desktop experience

- 🧠 Smart checkboxes and streak logic **(Work In Progress)**

- 🔐 Protected routes with JWT authentication

- 📦 Modular and reusable components

- ❌ Graceful WebGL fallback with detection and UI adjustment

### 🔮 Future Features

- 📱 Build mobile app for iOS and Android using React Native or Flutter

- 🎙️ Add voice-controlled habit entry

- ⌚ Develop smartwatch companion app

- 🧠 AI-powered habit suggestions based on time, location, and behavior

---

## 📦 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/gitlep1/Habbitly.git
cd Habbitly
cd front-end
cd back-end

# Install dependencies
npm install
```

### 2. Set up your back-end .env file

```bash
PORT=<your port>
PG_HOST=<your pg host>
PG_DATABASE=<your database name>
PG_USER=<your pg user>
PG_PASSWORD=<your pg password>
PG_PORT=<your pg port>

JWT_SECRET="<your jwt secret>"

GMAIL_HOST="<your gmail host>"
GMAIL_EMAIL="<your gmail>"
CLIENT_ID="<your google client id>"
CLIENT_SECRET="<your google client secret>"
REFRESH_TOKEN="<your google refresh token>"

REDIRECT_URI="<your redirect uri>"

ALLOW_OAUTH_SETUP="<true if on localhost otherwise false>"

IMGUR_CLIENT_ID="<your imgur client id>"
IMGUR_CLIENT_SECRET="<your imgur secret>"

CLOUDINARY_CLOUD_NAME="<your cloudinary cloud name>"
CLOUDINARY_API_KEY="<your cloudinary api key>"
CLOUDINARY_API_SECRET="<your cloudinary api secret>"
CLOUDINARY_URL="<your cloudinary url>"
```

### 3. Set up your front-end .env file

```bash
VITE_API_BASE_URL=<your backend URL>
```

### 4. Run the back-end development server

```bash
cd back-end
npm start
```

### 5. Run the front-end development server

```bash
cd front-end
npm run dev
```

---

## 📁 Project Structure

### Frontend (/front-end)

```bash
src/
  ├── assets/ # Static files
  ├── components/
  │ ├── 3D-Backgrounds/ # WebGL-based animated backgrounds
  │ ├── AccountSettings/ # User profile and preference settings
  │ ├── HabitTracker/ # Core habit tracking routes
  │ ├── Homepage/ # Main dashboard routes
  │ ├── Landing/ # Landing page
  │ ├── Navbar/ # Navigation component
  │ └── Notfound/ # 404 page
  ├── CustomContexts/ # React context providers
  ├── CustomFunctions/ # Utility functions (cookies, AI, WebGL checks)
  ├── Desktop/ # Desktop-specific UI logic
  ├── Mobile/ # Mobile-specific UI logic
  App.jsx # Main app component and router
  main.jsx # React entry point
  app.scss # Global styles
  main.css # Tailwind/SCSS base styles
```

### Backend (/back-end)

```bash
├── **TESTS**/ # Test suite
├── controllers/ # Route controllers
├── db/ # DB config & seeders
├── queries/ # SQL logic
├── Utils/ # Helper functions
├── validation/
├── entryValidation.js # Checks extra query entries
│ ├── requireAuth.js # Old jsonwebtoken library
│ └── requireAuthv2.js # New Jose JWT library
index.js # Express server entry
```

---

## 🚀 Deployment

- You can deploy this app using:

  - Frontend → Vercel / Netlify

  - Backend → Vercel

```bash
npm run build # frontend
vercel deploy # or netlify deploy
```

---

## 🧪 Future Improvements

- AI-augmented goal suggestions based on personality typing

- Multi-language support

- Voice-command-based habit logging

- Gamified accountability partners

- Real-time updates and offline-friendly habit tracking

- Enhanced synchronization logic (ex: WebSocket updates)

---

## 💡 Inspiration

Habbitly was built to help people build better habits without relying on gamified, competitive rewards that can backfire. It’s designed for users who want self-guided, introspective growth through behavioral insights and subtle motivation.

---

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

You may:

- Use and modify the code for personal/non-commercial use.

- Share the project with credit.

You may not:

- Use it commercially without permission.

➡️ [Read Full License](https://creativecommons.org/licenses/by-nc/4.0/)
