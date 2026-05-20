# 🗺️ TourGuide

A hyperlocal tourism guide booking platform connecting travelers with verified local guides for authentic city experiences.

## Tech Stack

**Frontend** — React 19, Vite, Tailwind CSS, Clerk Auth, React Router v7, Axios

**Backend** — Node.js, Express 5, PostgreSQL, JWT, bcrypt, Cloudinary, Razorpay

## Features

### For Travelers
- Browse & book verified local guides
- Detailed guide profiles with reviews & ratings
- Secure payments via Razorpay
- Booking history & cancellation
- Leave reviews & ratings
- Travel history tracking

### For Local Guides
**Profile Setup Interface:**
- Create professional guide profile with photo (Cloudinary)
- Specify city, speciality, experience level, hourly rate
- Add bio & multilingual support
- Define availability slots (Morning, Afternoon, Evening, Full Day)
- Add service highlights & specializations

**Dashboard & Management:**
- Real-time booking statistics (Requested, Confirmed, Completed)
- Manage booking requests (Accept/Reject/Complete)
- View customer reviews & ratings
- Toggle availability status
- Booking history with completion codes

### General
- Secure JWT-based authentication with Clerk
- Role-based access (Traveler/Guide)
- City-wise guide discovery
- Responsive design across devices

## Live Deployment

- **Frontend** — https://tour-guide-sigma.vercel.app
- **Backend** — https://tourguide-h3sn.onrender.com

## Getting Started

```bash
# Clone
git clone https://github.com/OmBilthere/TourGuide.git

# Backend
cd server && npm install && npm run server

# Frontend
cd client && npm install && npm run dev
```

