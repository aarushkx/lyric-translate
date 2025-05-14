"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/",
            icon: <Home className="h-4 w-4" />,
            label: "Home",
        },
        {
            href: "/songs",
            icon: <BookOpen className="h-4 w-4" />,
            label: "Browse",
        },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-sidebar shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                                    pathname === item.href
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground outline-1"
                                        : "bg-sidebar-accent/50 text-sidebar-accent-foreground/80 hover:bg-accent hover:outline-1 hover:text-accent-foreground"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
