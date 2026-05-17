import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const parseCsv = (value) => {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
};

const SLOT_PRESETS = [
  "Morning (6AM - 11AM)",
  "Afternoon (12PM - 4PM)",
  "Evening (5PM - 8PM)",
  "Full Day (6AM - 6PM)",
];

const HIGHLIGHT_PRESETS = [
  "Covers all major landmarks and off-beat spots",
  "Expert in city history and architecture",
  "Multilingual guide with French fluency",
];

const GuideOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const isEditMode = location.pathname === "/guide/profile/edit";

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    city: "",
    speciality: "",
    experience_years: "",
    price: "",
    about: "",
    phone: "",
    languagesCsv: "",
    highlights: [],
    slots: [],
    customHighlightsCsv: "",
    customSlotsCsv: "",
  });

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        setLoadingData(true);

        const [citiesRes, profileRes] = await Promise.all([
          axios.get(`${API_BASE}/api/cities`, { signal: controller.signal }),
          axios.get(`${API_BASE}/api/guides/me/profile`, {
            ...authHeaders,
            signal: controller.signal,
          }),
        ]);

        const cityList = citiesRes.data?.cities || [];
        setCities(cityList);

        const profile = profileRes.data?.profile;
        if (profile) {
          localStorage.setItem("tg_guide_profile_completed", "true");
          setForm({
            city: profile.city || "",
            speciality: profile.speciality || "",
            experience_years: profile.experience_years ? String(profile.experience_years) : "",
            price: profile.price ? String(profile.price) : "",
            about: profile.about || "",
            phone: profile.phone || "",
            languagesCsv: Array.isArray(profile.languages) ? profile.languages.join(", ") : "",
            highlights: Array.isArray(profile.highlights) ? profile.highlights : [],
            slots: Array.isArray(profile.slots) ? profile.slots : [],
            customHighlightsCsv: "",
            customSlotsCsv: "",
          });
        }
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) {
          console.error("Guide onboarding load failed:", error);
          toast.error(error.response?.data?.message || "Failed to load onboarding data");
        }
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
    return () => controller.abort();
  }, [API_BASE, authHeaders]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleOption = (field, value) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const mergedHighlights = [
        ...new Set([...form.highlights, ...parseCsv(form.customHighlightsCsv)]),
      ];
      const mergedSlots = [
        ...new Set([...form.slots, ...parseCsv(form.customSlotsCsv)]),
      ];

      if (mergedHighlights.length === 0) {
        toast.error("Please select at least one highlight");
        setLoading(false);
        return;
      }

      if (mergedSlots.length === 0) {
        toast.error("Please select at least one slot");
        setLoading(false);
        return;
      }

      const payload = {
        city: form.city,
        speciality: form.speciality,
        experience_years: Number(form.experience_years),
        price: Number(form.price),
        about: form.about,
        phone: form.phone || null,
        languages: parseCsv(form.languagesCsv),
        highlights: mergedHighlights,
        slots: mergedSlots,
      };

      await axios.put(`${API_BASE}/api/guides/me/profile`, payload, authHeaders);

      localStorage.setItem("tg_guide_profile_completed", "true");
      toast.success(isEditMode ? "Guide profile updated" : "Guide profile saved");
      navigate("/guide/dashboard");
    } catch (error) {
      console.error("Guide onboarding save failed:", error);
      toast.error(error.response?.data?.message || "Failed to save guide profile");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="px-4 sm:px-20 xl:px-32 py-20 text-center text-slate-500">
        Loading onboarding...
      </div>
    );
  }

  const highlightOptions = [...new Set([...HIGHLIGHT_PRESETS, ...form.highlights])];
  const slotOptions = [...new Set([...SLOT_PRESETS, ...form.slots])];

  return (
    <div className="w-full">
      <div className="px-4 sm:px-20 xl:px-32 py-10">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-sky-50 to-purple-50 px-6 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-3">
              {isEditMode ? "Update Guide Profile" : "Complete Guide Profile"}
            </h1>
            <p className="text-slate-600">
              {isEditMode
                ? "Update your guide details to keep your profile accurate."
                : "Completing these details is required to access your guide dashboard."}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-20 xl:px-32 pb-12">
        <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5 mt-8">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">City</span>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              required
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Speciality</span>
            <input
              type="text"
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              placeholder="Heritage walks"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Experience (Years)</span>
            <input
              type="number"
              min="0"
              step="1"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Price per Tour (INR)</span>
            <input
              type="number"
              min="0"
              step="1"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              required
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-2">
            <span className="text-sm text-gray-600">About</span>
            <textarea
              rows={4}
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Tell tourists why they should book you"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-2">
            <span className="text-sm text-gray-600">Languages (comma separated)</span>
            <input
              type="text"
              name="languagesCsv"
              value={form.languagesCsv}
              onChange={handleChange}
              placeholder="Hindi, English, French"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Phone / Mobile</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 91234 56789"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </label>

          <div className="sm:col-span-2 flex flex-col gap-3">
            <span className="text-sm text-gray-600">Top Highlights</span>
            <div className="flex flex-wrap gap-3">
              {highlightOptions.map((item) => {
                const active = form.highlights.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleOption("highlights", item)}
                    className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                      active
                        ? "bg-sky-500 text-white border-sky-500"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              name="customHighlightsCsv"
              value={form.customHighlightsCsv}
              onChange={handleChange}
              placeholder="Add custom highlights (comma separated)"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-3">
            <span className="text-sm text-gray-600">Available Slots</span>
            <div className="flex flex-wrap gap-3">
              {slotOptions.map((item) => {
                const active = form.slots.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleOption("slots", item)}
                    className={`px-4 py-2 rounded-xl border transition cursor-pointer ${
                      active
                        ? "bg-sky-500 text-white border-sky-500"
                        : "bg-white text-slate-700 border-slate-300 hover:border-sky-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              name="customSlotsCsv"
              value={form.customSlotsCsv}
              onChange={handleChange}
              placeholder="Add custom slots (comma separated)"
              className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Saving..." : isEditMode ? "Update Profile" : "Save and Continue"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default GuideOnboarding;
