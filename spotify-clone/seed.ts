import { prisma } from "./lib/prisma";

async function seedDatabase() {
  try {
    // Create a demo user for the songs
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@spotify.com" },
      update: {},
      create: {
        email: "demo@spotify.com",
        name: "Spotify Demo",
        password: "demo123", // This won't be used for auth
      },
    });

    // Sample songs data
    const sampleSongs = [
      {
        title: "Electronic Dreams",
        author: "Digital Artist",
        songPath: "/uploads/songs/demo1.mp3",
        imagePath: "/uploads/images/demo1.jpg",
        userId: demoUser.id,
      },
      {
        title: "Acoustic Sunset",
        author: "Folk Musician",
        songPath: "/uploads/songs/demo2.mp3", 
        imagePath: "/uploads/images/demo2.jpg",
        userId: demoUser.id,
      },
      {
        title: "Jazz in the Night",
        author: "Jazz Ensemble",
        songPath: "/uploads/songs/demo3.mp3",
        imagePath: "/uploads/images/demo3.jpg", 
        userId: demoUser.id,
      },
      {
        title: "Rock Anthem",
        author: "Rock Band",
        songPath: "/uploads/songs/demo4.mp3",
        imagePath: "/uploads/images/demo4.jpg",
        userId: demoUser.id,
      },
      {
        title: "Chill Vibes",
        author: "Lo-Fi Producer",
        songPath: "/uploads/songs/demo5.mp3",
        imagePath: "/uploads/images/demo5.jpg",
        userId: demoUser.id,
      },
    ];

    // Check if songs already exist
    const existingSongs = await prisma.song.count();
    
    if (existingSongs === 0) {
      console.log("Adding demo songs to database...");
      
      for (const songData of sampleSongs) {
        await prisma.song.create({
          data: songData,
        });
      }
      
      console.log(`✅ Added ${sampleSongs.length} demo songs to the database`);
    } else {
      console.log(`Database already has ${existingSongs} songs. Skipping seed.`);
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase();