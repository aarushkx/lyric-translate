"use client";

import React, { useEffect, useState } from "react";
import SongCard from "./_components/SongCard";
import Link from "next/link";
import { ISong } from "@/types";
import { ChevronLeft, Loader2, Search } from "lucide-react";

const SongsPage = () => {
    const [songs, setSongs] = useState<ISong[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch("/api/songs");
                const data = await res.json();
                if (res.ok) {
                    setSongs(data.data);
                } else {
                    setError(data.error || "Failed to fetch songs");
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const filteredSongs = songs.filter(
        (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-destructive max-w-4xl">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-6 max-w-4xl w-full">
            {/* Header section */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold">Song Library</h1>
            </div>

            {/* Search-bar */}
            <div className="mb-6">
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search songs or artists..."
                        className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song) => (
                        <SongCard key={song._id.toString()} song={song} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {searchQuery
                            ? "No matching songs found"
                            : "No songs in the library"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongsPage;
