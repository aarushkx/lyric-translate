"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ISong } from "@/types";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import {
    OriginalLyrics,
    TranslatedLyrics,
    Vocabulary,
    ExampleSentences,
} from "@/app/_components";

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
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSong();
    }, [params.title]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="container mx-auto p-4 text-center text-destructive max-w-4xl">
                Error: {error || "Song not found"}
            </div>
        );
    }

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header section */}
                <div className="flex items-start gap-4 mb-6">
                    <Link
                        href="/songs"
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>

                    <div className="flex items-center gap-4">
                        {song.image && (
                            <div className="relative h-12 w-12 flex-shrink-0">
                                <Image
                                    src={song.image}
                                    alt={`${song.title} cover`}
                                    fill
                                    className="rounded-sm object-cover"
                                    sizes="48px"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {song.title}
                            </h1>
                            <p className="text-muted-foreground">
                                {song.artist}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lyrics sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <OriginalLyrics
                        song={{
                            title: song.title,
                            artist: song.artist,
                            lyrics: song.originalLyrics,
                            image: song.image,
                        }}
                    />

                    {song.translatedLyrics && (
                        <TranslatedLyrics translation={song.translatedLyrics} />
                    )}
                </div>

                {/* Vocabulary and examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Vocabulary vocabulary={song.vocabulary} />
                    <ExampleSentences
                        exampleSentences={song.exampleSentences}
                    />
                </div>
            </div>
        </div>
    );
}
