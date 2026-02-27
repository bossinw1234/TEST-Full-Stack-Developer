import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
  🎵 Music Genre Tag Pool
*/
const TAG_POOL = [
  'rock', 'pop', 'hip-hop', 'jazz', 'blues',
  'classical', 'electronic', 'edm', 'house', 'techno',
  'trap', 'rnb', 'country', 'reggae', 'punk',
  'metal', 'indie', 'lofi', 'k-pop', 'latin',
];

/*
  📐 Image Sizes
*/
const SIZES = [
  { width: 400, height: 300 },
  { width: 600, height: 400 },
  { width: 300, height: 400 },
  { width: 500, height: 500 },
  { width: 800, height: 600 },
  { width: 400, height: 600 },
  { width: 700, height: 400 },
  { width: 350, height: 350 },
  { width: 600, height: 300 },
  { width: 450, height: 600 },
];


const COLORS = [
  { bg: 'FEF5ED', text: '99A799' },
  { bg: 'D3E4CD', text: '3b4a40' },
  { bg: 'ADC2A9', text: 'FEF5ED' },
  { bg: '99A799', text: 'FEF5ED' },
  { bg: '3b4a40', text: 'D3E4CD' },
  { bg: 'f0e6d3', text: '7a8f7e' },
  { bg: 'e8d5c0', text: '6b7c72' },
  { bg: 'c5d8bf', text: '3b4a40' },
  { bg: '8aaa8b', text: 'FEF5ED' },
  { bg: '6b7c72', text: 'D3E4CD' },
  { bg: 'dce8d8', text: '4a5e4f' },
  { bg: 'b5c9b1', text: 'FEF5ED' },
  { bg: 'f5ebe0', text: '99A799' },
  { bg: '4a5e4f', text: 'ADC2A9' },
  { bg: 'e3d5ca', text: '6b7c72' },
];


function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generatePlaceholderUrl(
  width: number,
  height: number,
  bg: string,
  text: string,
  label: string
): string {
  return `https://placehold.co/${width}x${height}/${bg}/${text}?text=${encodeURIComponent(label)}`;
}

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.imageTag.deleteMany();
  await prisma.image.deleteMany();
  await prisma.tag.deleteMany();

  console.log('🧹 Cleared existing data');

  const createdTags = await Promise.all(
    TAG_POOL.map((name) =>
      prisma.tag.create({ data: { name } })
    )
  );

  console.log(`📌 Created ${createdTags.length} tags`);

  const TOTAL_IMAGES = 60;
  const images = [];

  for (let i = 0; i < TOTAL_IMAGES; i++) {
    const size = SIZES[i % SIZES.length];
    const color = COLORS[i % COLORS.length];

    const randomGenre = TAG_POOL[Math.floor(Math.random() * TAG_POOL.length)];
    const label = randomGenre.toUpperCase();

    const url = generatePlaceholderUrl(
      size.width,
      size.height,
      color.bg,
      color.text,
      label
    );

    const mainTag = createdTags.find((t) => t.name === randomGenre)!;

    const extraCount = Math.floor(Math.random() * 3) + 1;
    const extraTags = getRandomItems(createdTags, extraCount)
      .filter((t) => t.id !== mainTag.id);

    const selectedTags = [mainTag, ...extraTags];

    const image = await prisma.image.create({
      data: {
        url,
        width: size.width,
        height: size.height,
        tags: {
          create: selectedTags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    images.push(image);
  }

  console.log(`🖼️ Created ${images.length} `);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });