"use client";

import React from "react";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants";

const Footer = () => {
    return (
        <footer className="bg-muted py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                {APP_NAME} © {new Date().getFullYear()} | {APP_TAGLINE}
            </div>
        </footer>
    );
};

export default Footer;
