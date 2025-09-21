const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSongs() {
  try {
    // First, let's get or create a demo user for these songs
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@spotify.com" },
      update: {},
      create: {
        email: "demo@spotify.com",
        name: "Music Collection",
        password: "demo123",
      },
    });

    // Check if these songs already exist
    const existingMJ = await prisma.song.findFirst({
      where: {
        title: "Human Nature",
        author: "Michael Jackson"
      }
    });

    const existingLeAnne = await prisma.song.findFirst({
      where: {
        title: "How Do I Live",
        author: "LeAnn Rimes"
      }
    });

    const songsToAdd = [];

    if (!existingMJ) {
      songsToAdd.push({
        title: "Human Nature",
        author: "Michael Jackson",
        songPath: "/uploads/songs/human-nature.mp3", // You'll need to add the actual file
        imagePath: "/uploads/images/human-nature.jpg", // You'll need to add the actual cover art
        userId: demoUser.id,
      });
    }

    if (!existingLeAnne) {
      songsToAdd.push({
        title: "How Do I Live",
        author: "LeAnn Rimes",
        songPath: "/uploads/songs/how-do-i-live.mp3", // You'll need to add the actual file
        imagePath: "/uploads/images/how-do-i-live.jpg", // You'll need to add the actual cover art
        userId: demoUser.id,
      });
    }

    if (songsToAdd.length > 0) {
      console.log(`Adding ${songsToAdd.length} new songs to database...`);
      
      for (const songData of songsToAdd) {
        await prisma.song.create({
          data: songData,
        });
        console.log(`✅ Added: ${songData.title} by ${songData.author}`);
      }
    } else {
      console.log("Songs already exist in database.");
    }

    // Show all songs in database
    const allSongs = await prisma.song.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("\nAll songs in database:");
    allSongs.forEach(song => {
      console.log(`- ${song.title} by ${song.author}`);
    });

  } catch (error) {
    console.error("Error adding songs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addSongs();