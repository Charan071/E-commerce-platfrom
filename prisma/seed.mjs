import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const products = [
  {
    id: "p1",
    title: "Red Gold Kanchipuram Silk Saree",
    description:
      "A classic Kanchipuram silk saree woven with intricate zari work and a rich pallu. Perfect for weddings and festive occasions. This masterpiece of traditional craftsmanship features intricate temple motifs, a rich pallu, and a striking gold border that adds royal elegance.",
    price: 14800,
    originalPrice: 18000,
    discount: "18% OFF",
    material: "Pure Silk",
    colors: [
      { name: "Red", hex: "#8b0000" },
      { name: "Gold", hex: "#d4af37" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-1.png",
    isNew: true,
    stock: 2,
  },
  {
    id: "p2",
    title: "Green Temple Border Saree",
    description:
      "Timeless elegance embodied in a deep green hue with a traditional contrasting border. Handwoven with pure natural fibers ensuring an authentic and sustainable weaving process.",
    price: 10500,
    originalPrice: 14000,
    discount: "25% OFF",
    material: "Pure Silk",
    colors: [
      { name: "Green", hex: "#006400" },
      { name: "Gold", hex: "#d4af37" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-2.png",
    stock: 8,
  },
  {
    id: "p3",
    title: "Traditional Pink Silk Saree",
    description:
      "An elegant pink Kanchipuram silk saree that highlights the beauty of traditional motifs and exceptional artistry. Features a contrasting border that perfectly frames the drape.",
    price: 13200,
    material: "Soft Silk",
    colors: [
      { name: "Pink", hex: "#ffc0cb" },
      { name: "Magenta", hex: "#8b008b" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-3.png",
    stock: 3,
  },
  {
    id: "p4",
    title: "Beige Gold Kanchipuram Silk Saree",
    description:
      "Subtle elegance with a grand appeal. The beige body is beautifully contrasted by rich gold zari weaving, offering a sophisticated look for modern occasions while maintaining traditional roots.",
    price: 10900,
    originalPrice: 11500,
    discount: "15% OFF",
    material: "Pure Silk",
    colors: [
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Gold", hex: "#d4af37" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-4.png",
    stock: 5,
  },
  {
    id: "p5",
    title: "Mustard Kanchipuram Silk Saree",
    description:
      "Radiant mustard yellow silk saree with intricate golden zari border. A vibrant choice that stands out in any festive gathering.",
    price: 9800,
    material: "Pure Silk",
    colors: [
      { name: "Mustard", hex: "#ffdb58" },
      { name: "Brown", hex: "#8b4513" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-1.png",
    stock: 15,
  },
  {
    id: "p6",
    title: "Royal Purple Kanchipuram",
    description:
      "A stunning regal purple drape featuring rich zari threadwork and a magnificent pallu, designed to make a statement of sheer elegance.",
    price: 11200,
    originalPrice: 12500,
    discount: "10% OFF",
    material: "Silk Blend",
    colors: [
      { name: "Purple", hex: "#800080" },
      { name: "Pink", hex: "#ffc0cb" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-2.png",
    stock: 4,
  },
  {
    id: "p7",
    title: "Orange Zari Weave Saree",
    description:
      "Vibrant orange silk saree showcasing intricate all-over zari weaving. This exquisite piece combines striking color with exceptional traditional craftsmanship.",
    price: 11500,
    material: "Pure Silk",
    colors: [
      { name: "Orange", hex: "#ffa500" },
      { name: "Green", hex: "#008000" },
    ],
    category: "Kanchipuram Silk",
    image: "/images/saree-3.png",
    stock: 6,
  },
  {
    id: "p8",
    title: "Classic Ivory Banarasi Silk Saree",
    description:
      "An ethereal ivory Banarasi saree adorned with delicate silver and gold zari motifs, reflecting pure elegance and grace.",
    price: 15500,
    originalPrice: 18500,
    discount: "16% OFF",
    material: "Pure Silk",
    colors: [
      { name: "Ivory", hex: "#fffff0" },
      { name: "Silver", hex: "#c0c0c0" },
    ],
    category: "Banarasi Silk",
    image: "/images/saree-4.png",
    stock: 0,
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

const prisma = createPrismaClient();

async function main() {
  const categoryByName = new Map();

  for (const name of Array.from(new Set(products.map((product) => product.category)))) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: {
        id: `cat-${slug}`,
        name,
        slug,
      },
    });
    categoryByName.set(name, category.id);
  }

  for (const product of products) {
    const categoryId = categoryByName.get(product.category);
    if (!categoryId) {
      throw new Error(`Missing category for ${product.title}`);
    }

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        slug: slugify(product.title),
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        discount: product.discount ?? null,
        material: product.material,
        stock: product.stock,
        isNew: product.isNew ?? false,
        isActive: true,
        categoryId,
      },
      create: {
        id: product.id,
        title: product.title,
        slug: slugify(product.title),
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        discount: product.discount ?? null,
        material: product.material,
        stock: product.stock,
        isNew: product.isNew ?? false,
        isActive: true,
        categoryId,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: product.image,
          publicId: `seed/${product.id}/primary`,
          isHover: false,
          order: 0,
        },
      ],
    });

    await prisma.productColor.deleteMany({ where: { productId: product.id } });
    await prisma.productColor.createMany({
      data: product.colors.map((color) => ({
        productId: product.id,
        name: color.name,
        hex: color.hex,
      })),
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
