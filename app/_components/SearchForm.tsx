"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Languages } from "lucide-react";

interface SearchFormProps {
    initialTitle: string;
    initialArtist: string;
    searchLoading: boolean;
    translateLoading: boolean;
    canTranslate: boolean;
    error: string;
    onSearch: (title: string, artist: string) => void;
    onProcess: () => void;
}

const SearchForm = ({
    initialTitle,
    initialArtist,
    searchLoading,
    translateLoading,
    canTranslate,
    error,
    onSearch,
    onProcess,
}: SearchFormProps) => {
    const [songTitle, setSongTitle] = useState(initialTitle);
    const [artistName, setArtistName] = useState(initialArtist);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!songTitle.trim()) return;

        router.push(
            `/?title=${encodeURIComponent(
                songTitle
            )}&artist=${encodeURIComponent(artistName)}`
        );
        onSearch(songTitle, artistName);
    };

    return (
        <div className="bg-card rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-card-foreground"
                        >
                            Song <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            placeholder="e.g. Despacito"
                            required
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="artist"
                            className="block text-sm font-medium text-card-foreground"
                        >
                            Artist <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="artist"
                            type="text"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="e.g. Luis Fonsi"
                            required
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={searchLoading || !songTitle.trim()}
                        className="cursor-pointer flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {searchLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <Search className="h-4 w-4" />
                                <span>Search Lyrics</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onProcess}
                        disabled={translateLoading || !canTranslate}
                        className="cursor-pointer flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-md hover:bg-sidebar-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {translateLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Languages className="h-4 w-4" />
                                <span>Translate & Learn</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SearchForm;
