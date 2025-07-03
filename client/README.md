🕹️ Multiplayer Grid Coin Game
A real-time multiplayer coin collection game built using React, WebSockets, and a custom Node.js backend. Players join a room, stake an amount, and compete to collect coins on a grid. First to collect the most coins wins!

📸 Preview

Real-time movement, coins spawn dynamically, and players compete for rewards.

📦 Features
✅ Real-time multiplayer game using WebSockets.

✅ WASD controls to move around a grid.

✅ Stake modal to sign-in before starting the game.

✅ Animated coin spawning logic.

✅ Coin collection with live updates.

✅ Game ends with a winner based on collected coins.

✅ Highlighting the current user.

✅ Clean and responsive Tailwind CSS UI.

🧠 Tech Stack
Frontend Backend
React + TypeScript Node.js + WebSocket
Tailwind CSS Singleton Room Manager
Context API Game loop with setInterval
Vite/Next.js (your choice) Custom WebSocket server

🧩 Architecture Overview
AppContextProvider – global context for room info, socket, user account.

GameCanvas.tsx – main game UI and grid logic.

StakeModal.tsx – UI modal to handle stake confirmation.

Room.ts (server) – room management, player tracking, broadcasting events.

Manager.ts (server) – singleton instance to manage rooms and players.

🚀 Getting Started

1. Clone the Repo
   bash
   Copy
   Edit
   git clone https://github.com/your-username/multiplayer-coin-game.git
   cd multiplayer-coin-game
2. Install Dependencies
   bash
   Copy
   Edit

# Frontend

cd client
npm install

# Backend

cd ../server
npm install 3. Start the App
bash
Copy
Edit

# In /server

npm run dev

# In /client

npm run dev
Open your browser at http://localhost:5173 (or 3000 for Next.js) to start playing.

⚙️ Game Logic
🪙 Coin Spawning
Coins are pre-generated on game start.

Spawned every few seconds using a setInterval.

Stored in a queue and pushed into currentCoins one by one.

🎮 Player Movement
Controlled via WASD keys.

Movement is clamped within grid size using:

ts
Copy
Edit
const newX = Math.max(0, Math.min(GRID_SIZE - 1, player.x + dx));
On movement, client sends player-move to the server.

💰 Coin Collection
When a player's new position overlaps a coin:

coin-collected is emitted to the server.

Server removes coin and broadcasts to all.

UI updates coin state and player’s score.

📄 Event Types
Sent by Client
Type Payload
start-game { roomId }
player-move { roomId, playerId, newX, newY }
coin-collected { roomId, playerId, coinId }

Broadcast by Server
Type Payload
user-joined-room Full room data including players
game-started { coins: Coin[] }
player-moved { playerId, newX, newY }
coin-collected { playerId, coinId }
