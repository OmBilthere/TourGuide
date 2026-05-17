import React from "react";

const Contact = () => {
  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="mt-3 text-slate-600">For now, this page is a placeholder. Reach out on the details below.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl">📧</div>
          <h3 className="mt-3 font-semibold">Email</h3>
          <p className="text-sm text-slate-600 mt-1">support@tourguide.com</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl">📞</div>
          <h3 className="mt-3 font-semibold">Phone</h3>
          <p className="text-sm text-slate-600 mt-1">+91 6265******</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl">📍</div>
          <h3 className="mt-3 font-semibold">Office</h3>
          <p className="text-sm text-slate-600 mt-1">Jabalpur, India</p>
        </div>
      </div>

    </div>
  );
};

export default Contact;