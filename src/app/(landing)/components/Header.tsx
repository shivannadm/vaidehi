"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
    { id: "features", title: "Features" },
    { id: "pricing", title: "Pricing" },
    { id: "about", title: "About" },
    { id: "contact", title: "Contact" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`w-full z-30 top-0 sticky transition-shadow ${scrolled ? "shadow-sm bg-white/80 backdrop-blur" : "bg-transparent"}`}>
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <span className="font-bold text-lg">Trading<span className="text-indigo-600">Journal</span></span>
                    </Link>
                    <ul className="hidden md:flex items-center gap-6 ml-8">
                        {NAV.map((n) => (
                            <li key={n.id}>
                                <a href={`#${n.id}`} className="text-sm hover:text-indigo-600 transition">
                                    {n.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3">
                    <button className="hidden md:inline-block px-4 py-2 rounded-md border border-slate-200 text-sm hover:bg-slate-50">Get in touch</button>
                    <Link href="/signup"
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Sign up
                    </Link>

                    {/* Mobile menu toggle placeholder */}
                    <div className="md:hidden">
                        <button aria-label="open menu" className="p-2 rounded-md">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-800">
                                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
