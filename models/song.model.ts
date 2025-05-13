import mongoose, { Schema, Document } from "mongoose";

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

const songSchema: Schema<ISong> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            default: "Unknown",
        },
        image: String,
        originalLyrics: {
            type: String,
            required: true,
        },
        translatedLyrics: String,
        vocabulary: [
            {
                word: String,
                meaning: String,
            },
        ],
        exampleSentences: [
            {
                sentence: String,
                meaning: String,
            },
        ],
    },
    { timestamps: true }
);

export const Song =
    (mongoose.models.Song as mongoose.Model<ISong>) ||
    mongoose.model<ISong>("Song", songSchema);
