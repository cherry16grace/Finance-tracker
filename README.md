# 💰 AI-Powered Expense Manager

An intelligent full-stack finance management application that helps users track expenses, manage budgets, and gain AI-driven financial insights. Built using the MERN Stack with secure authentication and smart analytics.

---

## 🚀 Features

### 🔐 Authentication & Security

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Secure Password Storage

### 💸 Expense Management

* Add Income and Expenses
* Categorize Transactions
* Edit and Delete Transactions
* Transaction History Tracking

### 📊 Budget Management

* Create Monthly Budgets
* Track Spending Against Budgets
* Budget Utilization Monitoring
* Overspending Alerts

### 🤖 AI Financial Insights

* AI-generated spending analysis
* Personalized saving suggestions
* Expense pattern detection
* Smart financial recommendations
* Monthly financial summaries

### 📈 Dashboard & Analytics

* Real-time financial overview
* Total Income Tracking
* Total Expense Tracking
* Remaining Balance Calculation
* Interactive and responsive dashboard

### 🎨 User Interface

* Modern and Responsive Design
* Mobile-Friendly Layout
* Clean Dashboard Experience
* Easy Navigation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Context API
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js

### AI Integration

* OpenAI API / AI Model Integration
* Financial Recommendation Engine

---

## 📂 Project Structure

```text
finance-tracker/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/cherry16grace/Finance-tracker.git
cd Finance-tracker
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Run Backend:

```bash
npm start
```

or

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Run Frontend:

```bash
npm run dev
```

Application will run at:

```text
Frontend: http://localhost:5173
Backend : http://localhost:5000
```

---


## 🔄 Workflow

1. User registers or logs in.
2. User adds income and expense transactions.
3. Transactions are stored in MongoDB.
4. Budget limits are created and monitored.
5. AI analyzes spending behavior.
6. Personalized recommendations are generated.
7. Dashboard visualizes financial health.

---




## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---



## 👩‍💻 Author

Cheril Gracenciya

Computer Science Engineering Student

Passionate about Full Stack Development

⭐ If you found this project useful, consider giving it a star on GitHub!
