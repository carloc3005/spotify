import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import uniqid from "uniqid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please log in to upload songs" }, 
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User account not found" }, 
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const songFile = formData.get("song") as File;
    const imageFile = formData.get("image") as File;

    if (!title || !author || !songFile || !imageFile) {
      return NextResponse.json(
        { error: "Missing fields", message: "Please fill in all required fields" }, 
        { status: 400 }
      );
    }

    // Generate unique filenames
    const uniqueID = uniqid();
    const songFileName = `${uniqueID}-${songFile.name}`;
    const imageFileName = `${uniqueID}-${imageFile.name}`;

    // Convert files to buffer and save to filesystem
    const songBytes = await songFile.arrayBuffer();
    const songBuffer = Buffer.from(songBytes);
    const songPath = join(process.cwd(), "public/uploads/songs", songFileName);
    await writeFile(songPath, songBuffer);

    const imageBytes = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(imageBytes);
    const imagePath = join(process.cwd(), "public/uploads/images", imageFileName);
    await writeFile(imagePath, imageBuffer);

    // Save song to database with public URLs
    const song = await prisma.song.create({
      data: {
        title,
        author,
        songPath: `/uploads/songs/${songFileName}`,
        imagePath: `/uploads/images/${imageFileName}`,
        userId: user.id,
      }
    });

    return NextResponse.json({ 
      message: "Song uploaded successfully",
      song: {
        id: song.id,
        title: song.title,
        author: song.author,
        imagePath: song.imagePath,
        songPath: song.songPath
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Something went wrong during upload" }, 
      { status: 500 }
    );
  }
}
