import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');

    if (!songId) {
      return NextResponse.json({ message: 'Song ID is required' }, { status: 400 });
    }

    // Check if song is liked
    const likedSong = await prisma.likedSong.findUnique({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId: songId,
        },
      },
    });

    return NextResponse.json({ isLiked: !!likedSong });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
