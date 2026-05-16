import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const RequireGuideProfile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    const checkProfile = async () => {
      const role = localStorage.getItem("tg_user_role");
      const token = localStorage.getItem("token");
      const profileCompleted = localStorage.getItem("tg_guide_profile_completed") === "true";

      if (role !== "guide" || !token) {
        setStatus("not-guide");
        return;
      }

      if (profileCompleted) {
        setStatus("ready");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/guides/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.data?.profile) {
          localStorage.setItem("tg_guide_profile_completed", "true");
          setStatus("ready");
        } else {
          localStorage.setItem("tg_guide_profile_completed", "false");
          setStatus("incomplete");
        }
      } catch {
        setStatus("incomplete");
      }
    };

    checkProfile();
    return () => controller.abort();
  }, [API_BASE]);

  if (status === "checking") {
    return <div className="px-4 sm:px-20 xl:px-32 py-20 text-center">Checking guide profile...</div>;
  }

  if (status === "not-guide") {
    return <Navigate to="/choose-role" replace />;
  }

  if (status === "incomplete") {
    return <Navigate to="/guide/profile-required" replace />;
  }

  return <Outlet />;
};

export default RequireGuideProfile;
