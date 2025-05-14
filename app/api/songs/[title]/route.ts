import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";

export async function GET(
    _request: NextRequest,
    context: { params: { title: string } }
) {
    try {
        await connectToDatabase();

        const { params } = context;

        if (!params?.title) {
            return NextResponse.json(
                { error: "Song title is required" },
                { status: 400 }
            );
        }

        const title = decodeURIComponent(params.title);
        const song = await Song.findOne({ title });

        if (!song) {
            return NextResponse.json(
                { error: "Song not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            data: song,
        });
    } catch (_error: any) {
        return NextResponse.json(
            { error: "Failed to fetch song" },
            { status: 500 }
        );
    }
}
