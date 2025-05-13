import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";

export async function GET(_: NextRequest) {
    try {
        await connectToDatabase();

        const songs = await Song.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            status: "success",
            data: songs,
        });
    } catch (error: any) {
        console.log("Error in /api/songs:", error);
        return NextResponse.json(
            { error: "Failed to fetch songs" },
            { status: 500 }
        );
    }
}
