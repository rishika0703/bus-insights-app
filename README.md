🚌 Bus Insights

**Bus Insights** is a web application designed to improve school bus transportation transparency for parents, students, and administrators. The app is built using **React (Frontend)** and **Flask (Backend)**, and supports features like bus tracking, parent alerts, complaint registration, and announcements.

## 📌 Features
- 🔍 **Search Bus Details**: Lookup route numbers, stops, and assigned drivers.
- 📋 **Complaint Submission**: Parents can submit issues directly to the transport department.
- 📢 **School Announcements**: View latest school-wide alerts and transportation updates.
- ✅ **Simple UI**: Clean, user-friendly design for non-technical users.

## 🛠️ Technologies Used
### Frontend (React)
- `React`
- `useState`, `useEffect` hooks
- `Axios` for API requests
### Backend (Flask)
- `Flask`
- `Flask-CORS` for frontend-backend communication
- Reads data from local `.json` files (buses.json, complaints.json)

## 🚀 How to Run Locally
### 1️⃣ Backend Setup (Flask)
```bash
cd backend
pip install flask flask-cors
python app.py

### 2️⃣ Frontend Setup (React)
cd frontend
npm install
npm start
