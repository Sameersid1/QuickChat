# 🚀 QuickChat

QuickChat is a full-stack real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to connect, communicate instantly, and manage conversations efficiently with a scalable backend architecture.

---

## 📌 Features

- 🔐 User Authentication (JWT-based login/signup)
- 💬 Real-time one-to-one messaging
- 📁 Chat and message management
- 👤 User search and chat initiation
- 🕒 Latest message preview in chat list
- ⚡ Optimized backend with REST APIs
- 🧩 Scalable and modular code structure

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS / CSS
- Axios

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB (Mongoose)

**Authentication:**
- JSON Web Tokens (JWT)
- Bcrypt (password hashing)

---

## 📂 Project Structure
QuickChat/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── server.js
│
├── frontend/
│ ├── components/
│ ├── pages/
│ └── App.js
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sameersid1/quickchat.git
cd quickchat
2️⃣ Backend Setup
cd backend
npm install

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm start
🔗 API Endpoints (Sample)
Method	Route	Description
POST	/api/user	Register user
POST	/api/user/login	Login user
GET	/api/chat	Get user chats
POST	/api/chat	Create/access chat
POST	/api/message	Send message
🧠 Key Learnings
Building scalable REST APIs
Designing database schemas (User, Chat, Message)
Implementing authentication & authorization
Handling real-time-like messaging logic
Structuring full-stack applications
🚀 Future Improvements
🔴 Real-time messaging with Socket.io
👥 Group chats
🟢 Online/offline user status
📎 File & media sharing
🌙 Dark mode UI
🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Mohd Sameer

GitHub: https://github.com/Sameersid1

