"use client";

import React from "react";
import { APP_NAME } from "@/utils/constants";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold">
                        Welcome to {APP_NAME}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Learn languages through your favorite songs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
