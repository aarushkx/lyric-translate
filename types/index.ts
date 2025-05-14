import mongoose, { Document } from "mongoose";

export interface ISong extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    artist: string;
    image?: string;
    originalLyrics: string;
    translatedLyrics?: string;
    vocabulary: {
        word: string;
        meaning: string;
    }[];
    exampleSentences: {
        sentence: string;
        meaning: string;
    }[];
}

export interface IMaterials {
    vocabulary: {
        word: string;
        meaning: string;
    }[];
    exampleSentences: {
        sentence: string;
        meaning: string;
    }[];
}
