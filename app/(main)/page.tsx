"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Header,
    SearchForm,
    OriginalLyrics,
    TranslatedLyrics,
    Vocabulary,
    ExampleSentences,
} from "@/app/_components/";
import { IMaterials } from "@/types";

interface ICurrentSong {
    title: string;
    artist: string;
    lyrics: string;
    image?: string;
}

const HomePage = () => {
    const searchParams = useSearchParams();

    const [songTitle, setSongTitle] = useState<string>(
        searchParams.get("title") || ""
    );
    const [artistName, setArtistName] = useState<string>(
        searchParams.get("artist") || ""
    );
    const [currentSong, setCurrentSong] = useState<ICurrentSong | null>(null);
    const [translation, setTranslation] = useState<string>("");
    const [learningMaterials, setLearningMaterials] =
        useState<IMaterials | null>(null);
    const [canTranslate, setCanTranslate] = useState<boolean>(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [translateLoading, setTranslateLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const searchLyrics = async (title: string, artist: string) => {
        setSearchLoading(true);
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
                setLearningMaterials(null);
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
            setSearchLoading(false);
        }
    };

    const handleProcessSong = async () => {
        if (!currentSong || !canTranslate) return;

        setTranslateLoading(true);
        setError("");
        try {
            const processRes = await fetch("/api/songs/process", {
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

            const processData = await processRes.json();

            if (!processRes.ok) {
                setError(
                    processData.error ||
                        "An error occurred during processing. Please try again."
                );
                return;
            }

            setTranslation(processData.data.song.translatedLyrics);
            setLearningMaterials({
                vocabulary: processData.data.song.vocabulary,
                exampleSentences: processData.data.song.exampleSentences,
            });
            setCanTranslate(false);
        } catch (error: any) {
            setError(
                error.message ||
                    "An error occurred during processing. Please try again."
            );
        } finally {
            setTranslateLoading(false);
        }
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
        <div className="flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <SearchForm
                    initialTitle={songTitle}
                    initialArtist={artistName}
                    searchLoading={searchLoading}
                    translateLoading={translateLoading}
                    canTranslate={canTranslate}
                    error={error}
                    onSearch={searchLyrics}
                    onProcess={handleProcessSong}
                />

                {(currentSong?.lyrics || translation) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {currentSong?.lyrics && (
                            <OriginalLyrics song={currentSong} />
                        )}
                        {translation && (
                            <TranslatedLyrics translation={translation} />
                        )}
                    </div>
                )}

                {learningMaterials && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <Vocabulary vocabulary={learningMaterials.vocabulary} />
                        <ExampleSentences
                            exampleSentences={
                                learningMaterials.exampleSentences
                            }
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
