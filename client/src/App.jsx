import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import GuideDetails from "./pages/GuideDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CityDetails from "./pages/CityDetails";
import BookingHistory from "./pages/BookingHistory";

function App() {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Explore" element={<Explore />} />
          <Route path="Explore/:cityName" element={<CityDetails />} />
          <Route path="Explore/:cityName/guide/:guideId" element={<GuideDetails />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="history" element={<BookingHistory />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;