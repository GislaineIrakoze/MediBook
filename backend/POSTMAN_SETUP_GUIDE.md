# 📌 SanTech API - Postman Guide

## Quick Start - Import Collection

1. **Open Postman**
2. **Click "Import"** (top left)
3. **Select "Postman_Collection.json"** from `c:\Users\Mahoro\Desktop\Internship\santech\`
4. **Click Import**

---

## ⚡ Before You Send ANY Request

### Step 1: Create an Environment
1. Click **"Environments"** (left panel)
2. Click **"+"** to create new
3. Name it: `SanTech Dev`
4. Add these variables:
   ```
   token = (will auto-populate after login)
   userId = (will auto-populate after login)
   doctorToken = (will auto-populate after doctor login)
   doctorId = (will auto-populate after doctor login)
   ```
5. **Save** and **Select** this environment (top right dropdown)

---

## 🔑 Workflow - Do These IN ORDER

### 1️⃣ **Register a Patient**
   - **Request:** `1️⃣ AUTH - REGISTER PATIENT`
   - **Pre-filled Data:**
     - Email: `patient@example.com`
     - Password: `password123`
   - **Click "Send"**
   - ✓ Token will auto-save to `{{token}}` variable

### 2️⃣ **Register a Doctor** (Optional, needed for appointments)
   - **Request:** `3️⃣ AUTH - REGISTER DOCTOR`
   - **Pre-filled Data:**
     - Email: `doctor@example.com`
     - Password: `password123`
   - **Click "Send"**

### 3️⃣ **Login as Doctor**
   - **Request:** `4️⃣ AUTH - LOGIN DOCTOR`
   - **Pre-filled Data:**
     - Email: `doctor@example.com`
     - Password: `password123`
   - **Click "Send"**
   - ✓ Doctor token will auto-save to `{{doctorToken}}`

### 4️⃣ **Create Doctor Availability**
   - **Request:** `7️⃣ DOCTOR AVAILABILITY - POST`
   - **Auto-filled with:** Doctor ID & time slot
   - **Click "Send"**
   - ✓ Doctor is now available for bookings

### 5️⃣ **View Doctor Availability**
   - **Request:** `9️⃣ DOCTOR AVAILABILITY - GET SINGLE`
   - **Click "Send"**
   - ✓ Verify doctor has available slots

### 6️⃣ **Book an Appointment**
   - **Request:** `🔟 APPOINTMENTS - BOOK`
   - **Auto-filled with:** Patient ID, Doctor ID, appointment date & time
   - **Click "Send"**
   - ✓ Appointment successfully booked!

### 7️⃣ **View All Appointments**
   - **Request:** `1️⃣1️⃣ APPOINTMENTS - GET ALL`
   - **Click "Send"**
   - ✓ See all appointments in the system

---

## 🧪 Testing & Troubleshooting

### ✅ Test Invalid Token (Should Get 401)
- **Request:** `🔐 TEST - INVALID TOKEN`
- **Click "Send"**
- Should get: `401 Unauthorized - Invalid token`

### ✅ Test No Token (Should Get 401)
- **Request:** `5️⃣ USERS - GET ALL USERS`
- **Remove Authorization header temporarily**
- **Click "Send"**
- Should get: `401 Unauthorized - No token provided`

### ✅ Add Authorization Header Manually
If variables don't work, manually add header:
```
Header Name: Authorization
Value: Bearer your_actual_token_here
```

---

## 📝 IF TOKEN STILL FAILS (JWT Malformed)

The error `"jwt malformed"` means the token string is corrupted. Try these:

### 1. Check the Token Format
- After login, look at response body
- Token should start with: `eyJ...`
- It should be a long string (200+ characters)
- ❌ If it has newlines or extra spaces → problem

### 2. Check Environment Variable
- Click **"Environment"** button (top right)
- Search for `token`
- It should show the full token
- ❌ If it's truncated or has spaces → copy/paste manually

### 3. Fix Authorization Header
Go to request → Authorization tab:
- **Type:** `Bearer Token`
- **Token:** `{{token}}`
- Click **"Save"**

### 4. Restart Server
In terminal:
```powershell
cd c:\Users\Mahoro\Desktop\Internship\santech
npm run dev
```

---

## 🔍 Reading Server Logs

When you send a request, check the terminal for:

**✓ Success:**
```
✓ Token verified for user: 12345-abc...
```

**❌ Failure:**
```
❌ Auth error: JsonWebTokenError - jwt malformed
```

---

## 📋 Database Test Data

**Pre-configured Patient:**
- Email: `patient@example.com`
- Password: `password123`

**Pre-configured Doctor:**
- Email: `doctor@example.com`
- Password: `password123`

---

## 🛠 API Endpoints Reference

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---|---------|
| POST | `/api/register` | ❌ | Register new user |
| POST | `/api/login` | ❌ | Login & get token |
| GET | `/api/users` | ✅ | Get all users |
| GET | `/api/users/:id` | ✅ | Get single user |
| POST | `/api/doctor-availability` | ✅ | Create availability |
| GET | `/api/doctor-availability` | ✅ | Get all availability |
| POST | `/api/appointments` | ✅ | Book appointment |
| GET | `/api/appointments` | ✅ | Get all appointments |

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Check if you ran the Login request first |
| **jwt malformed** | Clear token, run Login again, copy full token |
| **Invalid credentials** | Use: `patient@example.com` / `password123` |
| **Connection refused** | Make sure server is running: `npm run dev` |
| **Token expired** | Login again to get fresh token |

---

## 🚀 You're Ready!

Start with **Step 1️⃣** and follow the workflow. Each request builds on the previous one!
