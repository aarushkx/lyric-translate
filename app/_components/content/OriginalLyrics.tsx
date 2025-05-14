"use client";

import React from "react";
import Image from "next/image";
import { Music } from "lucide-react";

interface OriginalLyricsProps {
    song: {
        title: string;
        artist: string;
        lyrics: string;
        image?: string;
    };
}

const OriginalLyrics = ({ song }: OriginalLyricsProps) => {
    return (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="flex items-start p-3 border-b border-border bg-card/70">
                {song.image ? (
                    <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                            src={song.image}
                            alt={song.title}
                            fill
                            className="rounded-md object-cover"
                            sizes="40px"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}
                <div className="ml-3 min-w-0">
                    <h2 className="text-md font-medium text-card-foreground break-words">
                        {song.title}
                    </h2>
                    {song.artist && (
                        <p className="text-xs text-muted-foreground truncate">
                            {song.artist}
                        </p>
                    )}
                </div>
            </div>
            <div className="p-4 bg-card/50 overflow-auto h-96">
                <pre className="whitespace-pre-wrap font-sans text-sm text-card-foreground">
                    {song.lyrics}
                </pre>
            </div>
        </div>
    );
};

export default OriginalLyrics;
