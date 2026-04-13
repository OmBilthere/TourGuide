import React from 'react'
import { ShieldCheck, MapPinned, Star, Clock3 } from 'lucide-react'

const WhyChooseUs = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Verified Local Guides",
      description:
        "Connect with trusted and verified local guides who know hidden gems, culture, and authentic experiences.",
    },
    {
      icon: <MapPinned className="w-10 h-10" />,
      title: "Personalized City Tours",
      description:
        "Get custom travel plans based on your interests like food, heritage, adventure, and photography.",
    },
    {
      icon: <Star className="w-10 h-10" />,
      title: "Top Rated Experiences",
      description:
        "Choose guides based on real traveler reviews, ratings, and previous successful tours.",
    },
    {
      icon: <Clock3 className="w-10 h-10" />,
      title: "Quick & Easy Booking",
      description:
        "Book your city guide instantly with flexible timings and transparent pricing.",
    },
  ]

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24">
      <div className="text-center">
        <h2 className="text-slate-800 text-[42px] font-semibold">
          Why Choose Us
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2">
          We make city exploration smarter, safer, and more personal with
          trusted local experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:-translate-y-1 transition duration-300"
          >
            <div className="mb-5 text-slate-700">{item.icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 leading-6">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhyChooseUs