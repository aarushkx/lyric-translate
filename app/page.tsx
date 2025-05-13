"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, Languages } from "lucide-react";

interface ICurrentSong {
    title: string;
    artist: string;
    lyrics: string;
    image?: string;
}

const Home = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [songTitle, setSongTitle] = useState<string>(
        searchParams.get("title") || ""
    );
    const [artistName, setArtistName] = useState<string>(
        searchParams.get("artist") || ""
    );
    const [currentSong, setCurrentSong] = useState<ICurrentSong | null>(null);
    const [translation, setTranslation] = useState<string>("");
    const [canTranslate, setCanTranslate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const searchLyrics = async (title: string, artist: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `/api/songs/get-lyrics?title=${encodeURIComponent(
                    title
                )}&artist=${encodeURIComponent(artist)}`
            );
            const data = await res.json();

            if (res.ok) {
                setCurrentSong({
                    title: data.data.title,
                    artist: data.data.artist,
                    lyrics: data.data.originalLyrics,
                    image: data.data.image,
                });
                setTranslation("");
                setCanTranslate(true);
            } else {
                setError(
                    data.error?.message ||
                        data.error ||
                        "Failed to fetch lyrics"
                );
                setCanTranslate(false);
            }
        } catch (error: any) {
            setError("Failed to fetch lyrics. Please try again.");
            setCanTranslate(false);
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!currentSong || !canTranslate) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/songs/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    song: {
                        title: currentSong.title,
                        artist: { name: currentSong.artist },
                        originalLyrics: currentSong.lyrics,
                        thumbnail: currentSong.image || "",
                    },
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setTranslation(data.data.song.translatedLyrics);
                setCanTranslate(false);
            } else {
                setError(
                    data.error?.message || data.error || "Failed to translate"
                );
            }
        } catch (error: any) {
            setError("Translation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!songTitle.trim()) {
            setError("Song title is required");
            return;
        }
        router.push(
            `/?title=${encodeURIComponent(
                songTitle
            )}&artist=${encodeURIComponent(artistName)}`
        );
        searchLyrics(songTitle, artistName);
    };

    useEffect(() => {
        const title = searchParams.get("title");
        if (title) {
            const artist = searchParams.get("artist") || "";
            setSongTitle(title);
            setArtistName(artist);
            searchLyrics(title, artist);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-indigo-800 mb-2">
                        Song Translator
                    </h1>
                    <p className="text-lg text-indigo-600">
                        Discover lyrics and translations
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Song Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={songTitle}
                                onChange={(e) => setSongTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g. Despacito"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="artist"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Artist
                            </label>
                            <input
                                id="artist"
                                type="text"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g. Luis Fonsi"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading || !songTitle.trim()}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Search Lyrics
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleTranslate}
                                disabled={loading || !canTranslate}
                                className={`flex-1 bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 ${
                                    !canTranslate
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-emerald-700"
                                }`}
                            >
                                <Languages className="h-5 w-5" />
                                Translate Lyrics
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div
                            className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                            aria-live="assertive"
                        >
                            {error}
                        </div>
                    )}
                </div>

                {(currentSong?.lyrics || translation) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentSong?.lyrics && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-indigo-600 px-6 py-3">
                                    <h2 className="text-lg font-semibold text-white">
                                        {currentSong.title}{" "}
                                        {currentSong.artist &&
                                            `by ${currentSong.artist}`}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-800 max-h-[500px] overflow-y-auto">
                                        {currentSong.lyrics}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {translation && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-emerald-600 px-6 py-3">
                                    <h2 className="text-lg font-semibold text-white">
                                        Translation
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-800 max-h-[500px] overflow-y-auto">
                                        {translation}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
