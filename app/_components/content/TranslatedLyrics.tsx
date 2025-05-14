"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface TranslatedLyricsProps {
    translation: string;
}

const TranslatedLyrics = ({ translation }: TranslatedLyricsProps) => {
    return (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-3 border-b border-border bg-card/70 h-[64px]">
                <h2 className="text-md font-medium text-card-foreground">
                    Translation
                </h2>
            </div>
            <div className="p-4 text-sm bg-card/50 overflow-auto h-96">
                <div className="text-card-foreground">
                    <ReactMarkdown
                        children={translation}
                        rehypePlugins={[rehypeRaw]}
                    />
                </div>
            </div>
        </div>
    );
};

export default TranslatedLyrics;
