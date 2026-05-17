import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const ChooseRole = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [loadingRole, setLoadingRole] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleSelectRole = async (selectedRole) => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }

    try {
      setLoadingRole(selectedRole);

      const res = await axios.post(`${API_BASE}/api/users/sync`, {
        clerk_user_id: user.id,
        full_name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar_url: user.imageUrl || "",
        role: selectedRole,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("tg_user_role", selectedRole);
      localStorage.setItem("tg_guide_profile_completed", selectedRole === "guide" ? "false" : "true");

      toast.success(`Signed in as ${selectedRole}`);

      if (selectedRole === "guide") {
        navigate("/guide/onboarding");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Role selection failed:", error);
      toast.error(error.response?.data?.message || "Failed to set role");
    } finally {
      setLoadingRole(null);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">Login required</h1>
          <p className="mt-3 text-gray-600">Please sign in to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 text-center">
          Choose your account type
        </h1>
        <p className="text-gray-600 text-center mt-3">
          You can continue as a tourist or guide.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          <button
            type="button"
            onClick={() => handleSelectRole("tourist")}
            disabled={Boolean(loadingRole)}
            className="rounded-2xl border border-sky-200 cursor-pointer bg-sky-50 p-6 text-left hover:bg-sky-100 transition disabled:opacity-60"
          >
            <p className="text-xl font-semibold text-slate-800">Tourist</p>
            <p className="mt-2 text-sm text-gray-600">Explore cities and book local guides.</p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole("guide")}
            disabled={Boolean(loadingRole)}
            className="rounded-2xl border border-emerald-200 cursor-pointer bg-emerald-50 p-6 text-left hover:bg-emerald-100 transition disabled:opacity-60"
          >
            <p className="text-xl font-semibold text-slate-800">Guide</p>
            <p className="mt-2 text-sm text-gray-600">Manage booking requests and tours.</p>
          </button>
        </div>

        {loadingRole && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Saving your role as {loadingRole}...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChooseRole;
