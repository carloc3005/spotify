import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const song = await prisma.song.findUnique({
      where: {
        id: id,
      },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Transform to match the expected Song interface
    const transformedSong = {
      id: song.id,
      user_id: song.userId,
      author: song.author,
      title: song.title,
      song_path: song.songPath,
      image_path: song.imagePath,
      created_at: song.createdAt.toISOString(),
      updated_at: song.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedSong);
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
