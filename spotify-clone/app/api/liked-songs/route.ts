import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json({ message: 'Song ID is required' }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await prisma.likedSong.findUnique({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId: songId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ message: 'Song already liked' }, { status: 400 });
    }

    // Create new like
    const likedSong = await prisma.likedSong.create({
      data: {
        userId: session.user.id,
        songId: songId,
      },
    });

    return NextResponse.json({ success: true, likedSong });
  } catch (error) {
    console.error('Error liking song:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json({ message: 'Song ID is required' }, { status: 400 });
    }

    // Delete the like
    const deletedLike = await prisma.likedSong.delete({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId: songId,
        },
      },
    });

    return NextResponse.json({ success: true, deletedLike });
  } catch (error) {
    console.error('Error unliking song:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
