import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ title: string }> }
) {
    const { title } = await params;

    try {
        await connectToDatabase();

        const decodedTitle = decodeURIComponent(title);
        const song = await Song.findOne({ title: decodedTitle });

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
