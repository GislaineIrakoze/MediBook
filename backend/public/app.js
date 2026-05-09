const state = {
  doctors: [],
  selectedDepartment: null,
  selectedDoctor: null,
  selectedAvailability: null,
  selectedSlot: null,
  patient: {
    token: "",
    user: null,
  },
  doctor: {
    token: "",
    user: null,
  },
  latestAppointment: null,
};

const els = {
  patientState: document.querySelector("#patientState"),
  doctorState: document.querySelector("#doctorState"),
  flowHeadline: document.querySelector("#flowHeadline"),
  flowSummary: document.querySelector("#flowSummary"),
  departmentChips: document.querySelector("#departmentChips"),
  doctorList: document.querySelector("#doctorList"),
  availabilityList: document.querySelector("#availabilityList"),
  appointmentOutput: document.querySelector("#appointmentOutput"),
  notificationList: document.querySelector("#notificationList"),
  doctorAppointments: document.querySelector("#doctorAppointments"),
  toast: document.querySelector("#toast"),
  patientRegisterForm: document.querySelector("#patientRegisterForm"),
  patientLoginForm: document.querySelector("#patientLoginForm"),
  doctorLoginForm: document.querySelector("#doctorLoginForm"),
  availabilityForm: document.querySelector("#availabilityForm"),
  bookingForm: document.querySelector("#bookingForm"),
  refreshNotifications: document.querySelector("#refreshNotifications"),
  loadDoctorAppointments: document.querySelector("#loadDoctorAppointments"),
};

const todayValue = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 10);
};

document.querySelector('input[name="availableDate"]').value = todayValue();

const showToast = (message, isError = false) => {
  els.toast.textContent = message;
  els.toast.style.background = isError
    ? "rgba(140, 36, 36, 0.96)"
    : "rgba(31, 36, 48, 0.94)";
  els.toast.classList.add("show");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2800);
};

const setHeadline = (headline, summary) => {
  els.flowHeadline.textContent = headline;
  els.flowSummary.textContent = summary;
};

const readForm = (form) => Object.fromEntries(new FormData(form).entries());

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "object" && (payload.error || payload.message)) ||
      response.statusText ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
};

const renderDepartments = () => {
  const departments = ["All", ...new Set(state.doctors.map((doctor) => doctor.department))];
  els.departmentChips.innerHTML = "";

  departments.forEach((department) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${state.selectedDepartment === department ? "active" : ""}`;
    button.textContent = department;
    button.addEventListener("click", () => {
      state.selectedDepartment = department;
      renderDepartments();
      renderDoctors();
    });
    els.departmentChips.appendChild(button);
  });
};

const renderDoctors = () => {
  const filteredDoctors = state.doctors.filter((doctor) => {
    if (!state.selectedDepartment || state.selectedDepartment === "All") return true;
    return doctor.department === state.selectedDepartment;
  });

  if (!filteredDoctors.length) {
    els.doctorList.innerHTML =
      '<div class="empty-state">No doctors match this department yet.</div>';
    return;
  }

  els.doctorList.innerHTML = "";
  filteredDoctors.forEach((doctor) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `doctor-card ${state.selectedDoctor?.id === doctor.id ? "selected" : ""}`;
    card.innerHTML = `
      <p class="eyebrow">${doctor.department}</p>
      <strong>${doctor.fullname}</strong>
      <p>${doctor.email}</p>
      <div class="doctor-meta">
        <span>${doctor.location || "Clinic location to be confirmed"}</span>
        <span>${doctor.PhoneNumber || "Contact on request"}</span>
      </div>
    `;

    card.addEventListener("click", async () => {
      state.selectedDoctor = doctor;
      state.selectedAvailability = null;
      state.selectedSlot = null;
      renderDoctors();
      setHeadline(
        "Doctor selected",
        `Next, load the available slots for ${doctor.fullname}.`
      );
      await loadAvailability();
    });

    els.doctorList.appendChild(card);
  });
};

const renderAvailability = (rows = []) => {
  if (!rows.length) {
    els.availabilityList.className = "slot-grid empty-state";
    els.availabilityList.textContent = "No published slots yet for this doctor.";
    return;
  }

  els.availabilityList.className = "slot-grid";
  els.availabilityList.innerHTML = "";

  rows.forEach((availability) => {
    availability.availableTimeSlots.forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      const selected =
        state.selectedAvailability?.id === availability.id && state.selectedSlot === slot;
      button.className = `slot-card ${selected ? "selected" : ""}`;
      button.innerHTML = `
        <strong>${slot}</strong>
        <p>${availability.availableDate}</p>
      `;
      button.addEventListener("click", () => {
        state.selectedAvailability = availability;
        state.selectedSlot = slot;
        renderAvailability(rows);
        setHeadline(
          "Slot selected",
          `You can now book ${slot} on ${availability.availableDate}.`
        );
      });
      els.availabilityList.appendChild(button);
    });
  });
};

const renderNotifications = (notifications = []) => {
  if (!notifications.length) {
    els.notificationList.innerHTML = "No notifications yet.";
    return;
  }

  els.notificationList.innerHTML = notifications
    .map(
      (notification) => `
        <article class="notification-card">
          <strong>${notification.isRead ? "Read" : "New"} notification</strong>
          <p>${notification.message}</p>
        </article>
      `
    )
    .join("");
};

const renderDoctorAppointments = (appointments = []) => {
  if (!appointments.length) {
    els.doctorAppointments.innerHTML = "No doctor appointments found yet.";
    return;
  }

  els.doctorAppointments.innerHTML = "";
  appointments.forEach((appointment) => {
    const article = document.createElement("article");
    article.className = "appointment-card";
    article.innerHTML = `
      <strong>${appointment.appointmentDate} at ${appointment.appointmentTime}</strong>
      <p>Status: ${appointment.status}</p>
      <p>Patient ID: ${appointment.patientId}</p>
      <p>Reason: ${appointment.reason}</p>
    `;

    if (appointment.status === "pending") {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Approve appointment";
      button.addEventListener("click", async () => {
        try {
          await request(`/api/appointments/${appointment.id}/approve`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${state.doctor.token}`,
            },
          });
          showToast("Appointment approved and patient notified.");
          setHeadline(
            "Confirmation sent",
            "The doctor approved the appointment and the patient can now see the confirmation."
          );
          await loadDoctorAppointments();
        } catch (error) {
          showToast(error.message, true);
        }
      });
      article.appendChild(button);
    }

    els.doctorAppointments.appendChild(article);
  });
};

const updateAuthBadges = () => {
  els.patientState.textContent = state.patient.user
    ? `Patient: ${state.patient.user.fullname}`
    : "Signed out";
  els.doctorState.textContent = state.doctor.user
    ? `Doctor: ${state.doctor.user.fullname}`
    : "Signed out";
};

const loadDoctors = async () => {
  try {
    state.doctors = await request("/api/doctors");
    if (!state.selectedDepartment) state.selectedDepartment = "All";
    renderDepartments();
    renderDoctors();
  } catch (error) {
    showToast(error.message, true);
  }
};

const loadAvailability = async () => {
  if (!state.patient.token) {
    showToast("Patient login is required before viewing doctor availability.", true);
    return;
  }
  if (!state.selectedDoctor) {
    showToast("Choose a doctor first.", true);
    return;
  }

  try {
    const rows = await request(
      `/api/doctor-availability?doctorId=${encodeURIComponent(state.selectedDoctor.id)}`,
      {
        headers: {
          Authorization: `Bearer ${state.patient.token}`,
        },
      }
    );
    renderAvailability(rows);
  } catch (error) {
    showToast(error.message, true);
  }
};

const loadNotifications = async () => {
  if (!state.patient.token) {
    showToast("Patient login is required before checking notifications.", true);
    return;
  }
  try {
    const notifications = await request("/api/notifications", {
      headers: {
        Authorization: `Bearer ${state.patient.token}`,
      },
    });
    renderNotifications(notifications);
  } catch (error) {
    showToast(error.message, true);
  }
};

const loadDoctorAppointments = async () => {
  if (!state.doctor.token) {
    showToast("Doctor login is required before loading appointments.", true);
    return;
  }
  try {
    const appointments = await request("/api/appointments", {
      headers: {
        Authorization: `Bearer ${state.doctor.token}`,
      },
    });
    renderDoctorAppointments(appointments);
  } catch (error) {
    showToast(error.message, true);
  }
};

els.patientRegisterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = readForm(event.currentTarget);

  try {
    const result = await request("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        role: "patient",
      }),
    });
    state.patient.token = result.token;
    state.patient.user = result.user;
    updateAuthBadges();
    setHeadline("Patient registered", "Choose a department and doctor to continue.");
    showToast("Patient account created.");
    await loadNotifications();
  } catch (error) {
    showToast(error.message, true);
  }
});

els.patientLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = readForm(event.currentTarget);

  try {
    const result = await request("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    state.patient.token = result.token;
    state.patient.user = result.user;
    updateAuthBadges();
    setHeadline("Patient signed in", "Choose a department, then select a doctor.");
    showToast("Patient login successful.");
    await loadNotifications();
  } catch (error) {
    showToast(error.message, true);
  }
});

els.doctorLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = readForm(event.currentTarget);

  try {
    const result = await request("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    state.doctor.token = result.token;
    state.doctor.user = result.user;
    updateAuthBadges();
    setHeadline(
      "Doctor signed in",
      "Publish availability or review pending appointments from the doctor desk."
    );
    showToast("Doctor login successful.");
    await loadDoctorAppointments();
  } catch (error) {
    showToast(error.message, true);
  }
});

els.availabilityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.doctor.user?.id || !state.doctor.token) {
    showToast("Doctor login is required before creating availability.", true);
    return;
  }

  const values = readForm(event.currentTarget);
  const availableTimeSlots = values.slots
    .split(",")
    .map((slot) => slot.trim())
    .filter(Boolean);

  try {
    await request("/api/doctor-availability", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.doctor.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId: state.doctor.user.id,
        availableDate: values.availableDate,
        availableTimeSlots,
      }),
    });
    showToast("Availability published.");
    if (state.selectedDoctor?.id === state.doctor.user.id) {
      await loadAvailability();
    }
  } catch (error) {
    showToast(error.message, true);
  }
});

els.bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.patient.token) {
    showToast("Patient login is required before booking.", true);
    return;
  }
  if (!state.selectedAvailability || !state.selectedSlot) {
    showToast("Choose an available time slot first.", true);
    return;
  }

  const values = readForm(event.currentTarget);

  try {
    const appointment = await request("/api/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.patient.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        availabilityId: state.selectedAvailability.id,
        availabilityDate: state.selectedAvailability.availableDate,
        appointmentTime: state.selectedSlot,
        reason: values.reason,
      }),
    });

    state.latestAppointment = appointment;
    els.appointmentOutput.textContent = JSON.stringify(appointment, null, 2);
    setHeadline(
      "Appointment saved",
      "The backend checked the slot, saved the appointment, and notified the doctor."
    );
    showToast("Appointment booked successfully.");
    await loadNotifications();
    if (state.doctor.token) {
      await loadDoctorAppointments();
    }
  } catch (error) {
    showToast(error.message, true);
  }
});

els.refreshNotifications.addEventListener("click", loadNotifications);
els.loadDoctorAppointments.addEventListener("click", loadDoctorAppointments);

updateAuthBadges();
loadDoctors();
