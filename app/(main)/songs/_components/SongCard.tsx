"use client";

import React from "react";
import Link from "next/link";
import { ISong } from "@/types";
import Image from "next/image";

const SongCard = ({ song }: { song: ISong }) => {
    return (
        <Link
            href={`/songs/${encodeURIComponent(song.title)}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/70 transition-colors duration-200"
        >
            {song.image && (
                <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                        src={song.image}
                        alt={`${song.title} cover`}
                        fill
                        className="rounded-sm object-cover"
                        sizes="64px"
                    />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-foreground truncate">
                    {song.title}
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                    {song.artist}
                </p>
            </div>
        </Link>
    );
};

export default SongCard;
