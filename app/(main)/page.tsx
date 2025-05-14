"use client";

import React from "react";
import { Suspense } from "react";
import { HomeContent } from "@/app/_components/index";

const HomePage = () => {
    return (
        <div className="flex flex-col bg-background text-foreground">
            <Suspense fallback={<div>Loading...</div>}>
                <HomeContent />
            </Suspense>
        </div>
    );
};

export default HomePage;
