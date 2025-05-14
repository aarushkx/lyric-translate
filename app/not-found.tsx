"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-card rounded-lg p-8 w-full max-w-xl text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-6xl font-bold text-primary">
                            404
                        </div>
                        <h1 className="text-2xl font-semibold text-card-foreground">
                            Page Not Found
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            The page you&apos;re looking for doesn&apos;t exist
                            or has been moved.
                        </p>

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Return Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
