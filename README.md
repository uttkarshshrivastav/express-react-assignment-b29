# MERN Stack Puzzle Application

## File Structure
```
mernstackkassignment/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leaderboardController.js
│   │   └── puzzleController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Attempt.js
│   │   ├── index.js
│   │   ├── puzzles.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leaderboard.js
│   │   └── puzzle.js
│   ├── services/
│   │   ├── leaderboardService.js
│   │   └── puzzleService.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── PuzzlePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Running locally


### Clone Repo
1. git clone https://github.com/uttkarshshrivastav/express-react-assignment-b29

 


### Backend Setup
Ensure MongoDB is running before starting the backend server.
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev or node server.js
   ```

### Frontend Setup
Now in new terminal window
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend
Create a `.env` file in the `backend` directory and add the following:
```env
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

### Frontend
Create a `.env` file in the `frontend` directory and add the following:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Features
1.Puzzle Fetching: * API to fetch a random puzzle.                                                                                                                 
2.Ability to filter and fetch puzzles based on difficulty levels (e.g., Easy, Medium, Hard).                                                                       
3.User System: * Full user authentication (Signup/Login).                                                                                                          
4.Persistence: Track which puzzles a user has already solved to show their progress.                                                                               
5. A Hint Button that remains disabled/hidden until a user has made a certain number of failed attempts.                                                           
6.Leaderboard: A page displaying user rankings based on the total number of puzzles solved.                                                                        
