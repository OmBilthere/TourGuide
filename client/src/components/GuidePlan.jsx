import React from "react";
import { useNavigate } from "react-router-dom";

const GuidePlan = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Dashboard",
      description: "Track requests and trip status from your main control panel.",
      cta: "Open Dashboard",
      path: "/guide/dashboard",
      tone: "bg-blue-50 border-blue-100",
    },
    {
      title: "Bookings",
      description: "Review all guide bookings and take quick confirmation actions.",
      cta: "View Bookings",
      path: "/guide/bookings",
      tone: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Profile",
      description: "Update highlights, slots, pricing, and other public guide details.",
      cta: "Update Profile",
      path: "/guide/profile/edit",
      tone: "bg-violet-50 border-violet-100",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto z-20 my-24 px-4 sm:px-20 xl:px-32">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">Guide Workspace</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Use these quick entry points to manage daily guide operations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {actions.map((action) => (
          <div key={action.title} className={`rounded-2xl border p-6 ${action.tone}`}>
            <h3 className="text-2xl font-semibold text-slate-800">{action.title}</h3>
            <p className="text-gray-600 mt-3 min-h-14">{action.description}</p>
            <button
              onClick={() => navigate(action.path)}
              className="mt-6 px-5 py-2.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
            >
              {action.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidePlan;
