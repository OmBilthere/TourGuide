

const GuideTestimonial = () => {
  const guideStories = [
    {
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "Sahil Khan",
      title: "Heritage Guide, Jaipur",
      content:
        "This panel helped me organize all requests in one place. I can now plan my day with less back-and-forth.",
      rating: 5,
    },
    {
      image: "https://randomuser.me/api/portraits/women/52.jpg",
      name: "Neha Joshi",
      title: "Food Walk Guide, Delhi",
      content:
        "My profile updates and slot controls are much easier now. Travelers can quickly understand what I offer.",
      rating: 4,
    },
    {
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      name: "Arjun Patel",
      title: "City Explorer Guide, Ahmedabad",
      content:
        "The dashboard workflow keeps my tours and confirmations clear. It is a smooth daily routine now.",
      rating: 5,
    },
  ];

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">What Guides Say</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Hear from active local guides who manage their bookings through this platform.
        </p>
      </div>

      <div className="flex flex-wrap mt-10 justify-center">
        {guideStories.map((story, index) => (
          <div
            key={index}
            className="p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {Array(5).fill(0).map((_, itemIndex) => (<span key={itemIndex} style={{ color: itemIndex < story.rating ? "#facc15" : "#d1d5db" }}>★</span>))}
            </div>
            <p className="text-gray-500 text-sm my-5">"{story.content}"</p>
            <hr className="mb-5 border-gray-300" />
            <div className="flex items-center gap-4">
              <img src={story.image} className="w-12 object-contain rounded-full" alt="" />
              <div className="text-sm text-gray-600">
                <h3 className="font-medium">{story.name}</h3>
                <p className="text-xs text-gray-500">{story.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideTestimonial;

