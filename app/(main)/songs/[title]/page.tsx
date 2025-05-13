"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ISong } from "@/models/song.model";
import ReactMarkdown from "react-markdown";

export default function SongDetailPage() {
    const params = useParams();
    const [song, setSong] = useState<ISong | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const res = await fetch(`/api/songs/${params.title}`);
                const data = await res.json();
                if (res.ok) {
                    setSong(data.data);
                } else {
                    setError(data.error || "Song not found");
                }
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchSong();
    }, [params.title]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="p-8 text-center text-red-600">
                Error: {error || "Song not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {song.image && (
                            <img
                                src={song.image}
                                alt={`${song.title} cover`}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                            />
                        )}

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {song.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            by {song.artist}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                                    Original Lyrics
                                </h2>
                                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
                                    {song.originalLyrics}
                                </pre>
                            </div>

                            {song.translatedLyrics && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-emerald-700">
                                        Translation
                                    </h2>
                                    <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
                                        <ReactMarkdown>
                                            {song.translatedLyrics}
                                        </ReactMarkdown>
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-purple-700">
                                    Vocabulary ({song.vocabulary.length})
                                </h2>
                                <div className="space-y-3">
                                    {song.vocabulary.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-purple-50 p-3 rounded-lg"
                                        >
                                            <p className="font-medium text-purple-800">
                                                {item.word}
                                            </p>
                                            <p className="text-gray-700">
                                                {item.meaning}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-amber-700">
                                    Example Sentences (
                                    {song.exampleSentences.length})
                                </h2>
                                <div className="space-y-3">
                                    {song.exampleSentences.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="bg-amber-50 p-3 rounded-lg"
                                            >
                                                <p className="font-medium text-amber-800">
                                                    {item.sentence}
                                                </p>
                                                <p className="text-gray-700">
                                                    {item.meaning}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
