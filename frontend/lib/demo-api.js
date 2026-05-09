import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "vercel-demo-secret-change-me-before-production";

const users = globalThis.__medibookUsers || [
  {
    id: 1,
    fullname: "Demo Patient",
    email: "patient@medibook.test",
    password: "password123",
    role: "patient",
    dob: "1999-01-01",
    gender: "female",
    PhoneNumber: "700000001",
    emergencyContact: "700000002"
  },
  {
    id: 2,
    fullname: "Dr. Amina Kareem",
    email: "doctor@medibook.test",
    password: "password123",
    role: "doctor",
    department: "Cardiology",
    dob: "1985-03-12",
    gender: "female",
    PhoneNumber: "700000003",
    emergencyContact: "700000004"
  },
  {
    id: 3,
    fullname: "Admin User",
    email: "admin@medibook.test",
    password: "password123",
    role: "admin",
    dob: "1990-01-01",
    gender: "other",
    PhoneNumber: "700000005",
    emergencyContact: "700000006"
  }
];

const availabilities = globalThis.__medibookAvailability || [
  {
    id: 1,
    doctorId: 2,
    availableDate: "2026-05-10",
    availableTimeSlots: ["09:00", "10:30", "14:00"]
  },
  {
    id: 2,
    doctorId: 2,
    availableDate: "2026-05-11",
    availableTimeSlots: ["11:00", "13:30", "16:00"]
  }
];

const appointments = globalThis.__medibookAppointments || [];
const notifications = globalThis.__medibookNotifications || [];

globalThis.__medibookUsers = users;
globalThis.__medibookAvailability = availabilities;
globalThis.__medibookAppointments = appointments;
globalThis.__medibookNotifications = notifications;

function send(res, status, payload) {
  return res.status(status).json(payload);
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function getBody(req) {
  if (typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

function authorize(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, fullname: user.fullname },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}

export function shouldUseDemoApi() {
  return !process.env.DATABASE_URL && (!process.env.DB_HOST || process.env.DB_HOST === "127.0.0.1");
}

export default async function demoApi(req, res) {
  const path = req.url.split("?")[0];
  const method = req.method;

  if (method === "GET" && path === "/api/health") {
    return send(res, 200, { ok: true, mode: "vercel-demo" });
  }

  if (method === "POST" && path === "/api/register") {
    const body = await getBody(req);
    if (!body.fullname || !body.email || !body.password) {
      return send(res, 400, { message: "Full name, email, and password are required" });
    }

    if (users.some((user) => user.email === body.email)) {
      return send(res, 409, { message: "Account already exists" });
    }

    const user = {
      id: users.length + 1,
      fullname: body.fullname,
      email: body.email,
      password: body.password,
      role: body.role || "patient",
      department: body.department || (body.role === "doctor" ? "General Medicine" : undefined),
      dob: body.dob || "",
      gender: body.gender || "other",
      PhoneNumber: body.PhoneNumber || "",
      emergencyContact: body.emergencyContact || ""
    };

    users.push(user);

    return send(res, 201, {
      message: "User created successfully",
      token: createToken(user),
      user: publicUser(user)
    });
  }

  if (method === "POST" && path === "/api/login") {
    const body = await getBody(req);
    const user = users.find((item) => item.email === body.email);

    if (!user) return send(res, 404, { message: "Account not found. Please register." });
    if (user.password !== body.password) return send(res, 401, { message: "Invalid credentials" });

    return send(res, 200, {
      message: "Login successful",
      token: createToken(user),
      user: publicUser(user)
    });
  }

  if (method === "GET" && path === "/api/doctors") {
    return send(
      res,
      200,
      users
        .filter((user) => user.role === "doctor")
        .map((user) => ({
          ...publicUser(user),
          department: user.department || "General Medicine"
        }))
    );
  }

  const currentUser = authorize(req);
  if (!currentUser) return send(res, 401, { message: "No token provided" });

  if (method === "GET" && path === "/api/doctor-availability") {
    const doctorId = Number(req.query.doctorId);
    return send(
      res,
      200,
      doctorId
        ? availabilities.filter((item) => item.doctorId === doctorId)
        : availabilities
    );
  }

  if (method === "GET" && path === "/api/appointments") {
    if (currentUser.role === "admin") return send(res, 200, appointments);
    return send(res, 200, appointments.filter((item) => item.patientId === currentUser.id));
  }

  if (method === "POST" && path === "/api/appointments") {
    const body = await getBody(req);
    const availability = availabilities.find((item) => item.id === Number(body.availabilityId));

    if (!availability) return send(res, 404, { message: "Availability not found" });

    const appointment = {
      id: appointments.length + 1,
      patientId: currentUser.id,
      doctorId: availability.doctorId,
      availabilityId: availability.id,
      appointmentDate: body.availabilityDate || availability.availableDate,
      appointmentTime: body.appointmentTime,
      reason: body.reason,
      status: "pending"
    };

    appointments.unshift(appointment);
    notifications.unshift({
      id: notifications.length + 1,
      userId: currentUser.id,
      message: "Your appointment request was submitted.",
      isRead: false
    });

    return send(res, 201, appointment);
  }

  if (method === "GET" && path === "/api/notifications") {
    if (currentUser.role === "admin") return send(res, 200, notifications);
    return send(res, 200, notifications.filter((item) => item.userId === currentUser.id));
  }

  return send(res, 404, { message: "Endpoint not found" });
}
