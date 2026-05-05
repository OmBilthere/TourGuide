import logo from "./logo.png";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
export const assets = {
    logo,
    star_icon,
    star_dull_icon

}

export const dummyBookings = [
  {
    id: "1",
    userId: "user_2abc123xyz",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    city: "Jaipur",
    slot: "10:00 AM - 12:00 PM",
    status: "confirmed",
    paymentStatus: "pending",
    bookedAt: "2024-01-15T10:30:00.000Z",
    guide: {
      id: 1,
      name: "Arjun Mehra",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      speciality: "Heritage & Culture",
      price: 800,
      phone: "+91 98765 43210",
      email: "arjun.mehra@gmail.com",
    },
  },
  {
    id: "2",
    userId: "user_2abc123xyz",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    city: "Agra",
    slot: "09:00 AM - 11:00 AM",
    status: "requested",
    paymentStatus: "pending",
    bookedAt: "2024-01-18T08:00:00.000Z",
    guide: {
      id: 2,
      name: "Priya Sharma",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      speciality: "Mughal History",
      price: 600,
      phone: "+91 91234 56789",
      email: "priya.sharma@gmail.com",
    },
  },
  {
    id: "3",
    userId: "user_2abc123xyz",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    city: "Varanasi",
    slot: "06:00 AM - 08:00 AM",
    status: "completed",
    paymentStatus: "paid",
    bookedAt: "2024-01-10T05:00:00.000Z",
    guide: {
      id: 3,
      name: "Deepak Pandey",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      speciality: "Ghats & Spiritual Tours",
      price: 500,
      phone: "+91 99887 76655",
      email: "deepak.pandey@gmail.com",
    },
  },
  {
    id: "4",
    userId: "user_2abc123xyz",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    city: "Delhi",
    slot: "02:00 PM - 04:00 PM",
    status: "cancelled",
    paymentStatus: "pending",
    bookedAt: "2024-01-12T13:00:00.000Z",
    guide: {
      id: 4,
      name: "Sneha Kapoor",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      speciality: "Street Food & Markets",
      price: 700,
      phone: "+91 88776 65544",
      email: "sneha.kapoor@gmail.com",
    },
  },
];