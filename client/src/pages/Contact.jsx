import React from "react";

const Contact = () => {
  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-slate-800">
          Contact Us
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
          Need help with booking a local guide, exploring destinations, or
          managing your trip plans? We’re here to help make your travel
          experience smooth and memorable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        {/* Left Info */}
        <div className="space-y-6">
          <div className="p-6 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              📍 Office
            </h2>
            <p className="text-gray-500 mt-2">
              Jabalpur, India
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              📧 Email
            </h2>
            <p className="text-gray-500 mt-2">
              support@tourguide.com
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              📞 Phone
            </h2>
            <p className="text-gray-500 mt-2">
              +91 6265******
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="border rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            Send a Message
          </h2>

          <form className="mt-6 space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />

            <button
              type="submit"
              className="bg-sky-500 text-white px-6 py-3 rounded-xl"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;