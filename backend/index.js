import express from 'express';
import sequelize from './src/config/db.js';
import dotenv from 'dotenv/config';
import cors from 'cors';
import UserRouter from './src/routes/user.js';
import AuthRoutes from './src/routes/auth.js';
import AppointmentRouter from './src/routes/appointments.js';
import DoctorAvailabilityRouter from './src/routes/doctorAvailability.js';
import NotificationRouter from './src/routes/notifications.js';
import path from 'path';
import { fileURLToPath } from 'url';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Auth routes (Register, Login)
app.use("/", AuthRoutes)

// User routes (Get all users, Get single user, etc.)
app.use("/", UserRouter)

// Appointment routes
app.use("/", AppointmentRouter)

// Doctor Availability routes
app.use("/", DoctorAvailabilityRouter)

// Notification routes
app.use("/", NotificationRouter)

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

sequelize.authenticate()
.then(() => sequelize.sync())
.then(()=>{
    
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
        console.log("Database connected successfully");
    })
    
    

})
.catch((error) => {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    })

