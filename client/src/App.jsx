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
import ChooseRole from "./pages/ChooseRole";
import GuideDashboard from "./pages/GuideDashboard";
import GuideBookings from "./pages/GuideBookings";
import GuideOnboarding from "./pages/GuideOnboarding";
import GuideProfileRequired from "./pages/GuideProfileRequired";
import RequireGuideProfile from "./components/RequireGuideProfile";

function App() {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route path="choose-role" element={<ChooseRole />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Explore" element={<Explore />} />
          <Route path="Explore/:cityName" element={<CityDetails />} />
          <Route path="Explore/:cityName/guide/:guideId" element={<GuideDetails />} />
          <Route path="guide/onboarding" element={<GuideOnboarding />} />
          <Route path="guide/profile-required" element={<GuideProfileRequired />} />
          <Route element={<RequireGuideProfile />}>
            <Route path="guide/dashboard" element={<GuideDashboard />} />
            <Route path="guide/bookings" element={<GuideBookings />} />
            <Route path="guide/profile/edit" element={<GuideOnboarding />} />
          </Route>
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