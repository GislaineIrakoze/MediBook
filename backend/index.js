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
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    "https://medi-book-phi.vercel.app",
    "http://localhost:3000"
]
    .filter(Boolean)
    .flatMap((origin) => origin.split(","))
    .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin) || /\.vercel\.app$/.test(new URL(normalizedOrigin).hostname)) {
            callback(null, true);
            return;
        }

        callback(null, false);
    }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/healthz", (_req, res) => {
    res.json({ ok: true });
});

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

