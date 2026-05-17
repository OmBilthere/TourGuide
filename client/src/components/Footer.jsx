import React from "react";
import logo from "../assets/logo.png";

const SocialIcon = ({ children, href, label }) => (
    <a href={href} aria-label={label} className="text-gray-400 hover:text-slate-700 transition">
        <span className="sr-only">{label}</span>
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm">{children}</div>
    </a>
);

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-white to-slate-50 border-t border-gray-100 mt-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-16">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-8">
                    <div className="flex items-start gap-4">
                        <img src={logo} alt="TourGuide" className="w-14 h-14 object-contain" />
                        <div>
                            <div className="text-xl font-semibold text-slate-900">TourGuide</div>
                            <div className="text-sm text-slate-600 mt-1">Local guides, real experiences.</div>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto mt-3 sm:mt-0">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-center sm:text-left">
                            <a href="/Explore" className="text-sm text-slate-700 hover:underline">Explore</a>
                            <a href="/guides" className="text-sm text-slate-700 hover:underline">Guides</a>
                            <a href="/bookings" className="text-sm text-slate-700 hover:underline">My Bookings</a>
                            <a href="/about" className="text-sm text-slate-700 hover:underline">About</a>
                            <a href="/contact" className="text-sm text-slate-700 hover:underline">Contact</a>
                            <a href="/faq" className="text-sm text-slate-700 hover:underline">Help / FAQ</a>
                        </div>
                    </div>


                    <div className="flex items-center gap-3">
                        <SocialIcon href="#" label="Instagram">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2H17C20 2 22 4 22 7V17C22 20 20 22 17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11.37C16.12 12.1 16.12 12.9 16 13.63C15.72 15.24 14.24 16.5 12.59 16.5C10.94 16.5 9.45999 15.24 9.17999 13.63C9.05999 12.9 9.05999 12.1 9.17999 11.37C9.45999 9.75999 10.94 8.5 12.59 8.5C14.24 8.5 15.72 9.75999 16 11.37Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </SocialIcon>
                        <SocialIcon href="#" label="Twitter">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3C22.0424 3.675 20.9821 4.19205 19.86 4.53C19.2577 3.8375 18.4573 3.34678 17.567 3.123C16.6767 2.89925 15.7395 2.95125 14.8821 3.27146C14.0247 3.59167 13.2884 4.16495 12.773 4.9C11.9275 4.873 11.1198 4.575 10.5 4.05C9.88021 3.525 9.5 2.815 9.5 2.06V1.5C8.2295 2.1505 6.86817 2.5753 5.47 2.75C4.07183 2.9247 2.6535 2.8453 1.3 2.52C0.5205 4.025 1.1805 6.01 2.86 6.87C2.3005 6.85 1.7605 6.695 1.27 6.41C1.27 8.02 2.28 9.43 3.75 9.88C3.1435 10.04 2.499 10.06 1.88 9.93C2.5 11.32 3.78 12.4 5.35 12.45C4.26 13.5 2.86 14.16 1.35 14.33C2.93 15.39 4.78 16 6.75 16C12.69 16 16.99 10.5 16.99 6.5C16.99 6.29 16.99 6.08 16.98 5.88C17.86 5.3 18.6 4.5 19.17 3.55C18.4 3.95 17.57 4.2 16.7 4.3C17.59 3.72 18.28 2.88 18.62 1.88C17.8 2.38 16.91 2.75 16 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </SocialIcon>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm sm:text-base text-slate-500">
                    <div>© {new Date().getFullYear()} TourGuide — All rights reserved.</div>
                    <div>Made by Om ❤️</div>
                    <div className="flex gap-4">
                        <a href="/privacy" className="hover:underline">Privacy</a>
                        <a href="/terms" className="hover:underline">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;