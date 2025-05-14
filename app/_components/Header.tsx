"use client";

import React from "react";
import { Music } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants";

const Header = () => {
    return (
        <header className="bg-accent py-12 px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-4 mx-auto bg-accent-foreground/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-accent-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                    {APP_NAME}
                </h1>
                <p className="text-accent-foreground/80">{APP_TAGLINE}</p>
            </div>
        </header>
    );
};

export default Header;
