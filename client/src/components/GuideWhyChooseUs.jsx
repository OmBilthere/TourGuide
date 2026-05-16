import React from "react";
import { CalendarCheck2, BadgeCheck, WalletCards, RefreshCw } from "lucide-react";

const GuideWhyChooseUs = () => {
  const features = [
    {
      icon: <CalendarCheck2 className="w-10 h-10" />,
      title: "Booking Management",
      description: "Track requests, confirm tours, and complete trips from one place.",
    },
    {
      icon: <BadgeCheck className="w-10 h-10" />,
      title: "Verified Guide Presence",
      description: "Build trust with a complete profile and visible public highlights.",
    },
    {
      icon: <WalletCards className="w-10 h-10" />,
      title: "Transparent Earnings",
      description: "Stay clear on pricing and trip amounts linked to your bookings.",
    },
    {
      icon: <RefreshCw className="w-10 h-10" />,
      title: "Flexible Availability",
      description: "Adjust your slot plans to match your city schedule and demand.",
    },
  ];

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24">
      <div className="text-center">
        <h2 className="text-slate-800 text-[42px] font-semibold">Why Guides Use TourGuide</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2">
          Everything a city guide needs to stay organized and get more quality bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:-translate-y-1 transition duration-300"
          >
            <div className="mb-5 text-slate-700">{item.icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-6">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideWhyChooseUs;
