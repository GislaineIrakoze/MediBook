import {
  FaHeartPulse,
  FaTooth,
  FaChild,
  FaBrain,
  FaBone,
  FaStethoscope
} from "react-icons/fa6";

export const departments = [
  {
    name: "Cardiology",
    icon: FaHeartPulse,
    description: "Heart screening, ECG review, and preventive cardiovascular care."
  },
  {
    name: "Dentistry",
    icon: FaTooth,
    description: "Routine oral care, cosmetic treatments, and restorative procedures."
  },
  {
    name: "Pediatrics",
    icon: FaChild,
    description: "Warm, child-focused consultations from infancy to adolescence."
  },
  {
    name: "Neurology",
    icon: FaBrain,
    description: "Advanced neurological assessment and long-term care planning."
  },
  {
    name: "Orthopedics",
    icon: FaBone,
    description: "Joint, muscle, and bone care with guided recovery support."
  },
  {
    name: "General Medicine",
    icon: FaStethoscope,
    description: "First-line diagnosis, chronic care, and preventive checkups."
  }
];

export const topDoctors = [
  {
    id: "doc-1",
    name: "Dr. Amina Kareem",
    specialty: "Cardiology",
    rating: 4.9,
    availability: "Available today",
    imageTone: "from-emerald-500 to-green-700"
  },
  {
    id: "doc-2",
    name: "Dr. Ethan Mensah",
    specialty: "Neurology",
    rating: 4.8,
    availability: "Next slot in 2 hours",
    imageTone: "from-green-400 to-emerald-600"
  },
  {
    id: "doc-3",
    name: "Dr. Grace Njeri",
    specialty: "Pediatrics",
    rating: 5.0,
    availability: "Available tomorrow",
    imageTone: "from-lime-400 to-emerald-700"
  }
];

export const testimonials = [
  {
    name: "Naomi A.",
    title: "Patient",
    quote:
      "MediBook made the whole process feel calm and dependable. Booking and confirmation were both instant and clear."
  },
  {
    name: "Patrick M.",
    title: "Patient",
    quote:
      "It feels like a premium hospital platform. I could find a doctor, choose a slot, and get updates without confusion."
  },
  {
    name: "Linda K.",
    title: "Caregiver",
    quote:
      "The dashboard layout is very clean. Everything important is visible without being overwhelming."
  }
];

export const processSteps = [
  {
    step: "01",
    title: "Choose doctor",
    text: "Browse departments, compare specialists, and select the doctor that fits the visit."
  },
  {
    step: "02",
    title: "Select date",
    text: "Review open schedules and pick the time slot that works best for the patient."
  },
  {
    step: "03",
    title: "Confirm booking",
    text: "Submit the reason for visit and let the system validate the availability instantly."
  },
  {
    step: "04",
    title: "Visit hospital",
    text: "Receive confirmation, arrive on time, and walk in with the appointment already organized."
  }
];
