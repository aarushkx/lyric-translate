"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ISong } from "@/models/song.model";

export default function SongsPage() {
    const [songs, setSongs] = useState<ISong[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">Error: {error}</div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Public Song Library
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {songs.map((song) => (
                        <SongCard key={song._id.toString()} song={song} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SongCard({ song }: { song: ISong }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                {song.image && (
                    <img
                        src={song.image}
                        alt={`${song.title} cover`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                )}
                <h2 className="text-xl font-bold text-gray-800">
                    {song.title}
                </h2>
                <p className="text-gray-600 mb-2">by {song.artist}</p>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {song.vocabulary.length} vocabulary words
                    </span>
                    <Link
                        href={`/songs/${encodeURIComponent(song.title)}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
