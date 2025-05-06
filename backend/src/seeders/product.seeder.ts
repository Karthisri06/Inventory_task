import { AppDataSource } from "../datasource";
import { Product } from "../entities/product";

export const seedProducts = async () => {
  await AppDataSource.initialize();
  const productRepo = AppDataSource.getRepository(Product);

  const products = [
    {
      name: "Multi-Surface Cleaner Spray",
      category: "Cleaning",
      sku: "CLN-001",
      price: 150.00,
      quantity: 50,
      brand: "SparkleFresh"
    },
    {
      name: "Microfiber Cleaning Cloth - Pack of 6",
      category: "Cleaning",
      sku: "CLN-002",
      price: 99.00,
      quantity: 100,
      brand: "CleanZone"
    },
    {
      name: "LED Table Lamp",
      category: "Lighting",
      sku: "LGT-001",
      price: 499.00,
      quantity: 30,
      brand: "BrightLite"
    },
    {
      name: "Plastic Storage Box - 15L",
      category: "Storage",
      sku: "STR-001",
      price: 299.00,
      quantity: 75,
      brand: "OrganizeIt"
    },
    {
      name: "Dishwashing Liquid - Lemon 1L",
      category: "Cleaning",
      sku: "CLN-003",
      price: 120.00,
      quantity: 60,
      brand: "DishDrop"
    },
    {
      name: "Rechargeable Emergency Light",
      category: "Lighting",
      sku: "LGT-002",
      price: 799.00,
      quantity: 20,
      brand: "SafeGlow"
    },
    {
      name: "Steel Wall Hook Set (Pack of 4)",
      category: "Home Utility",
      sku: "UTL-001",
      price: 180.00,
      quantity: 40,
      brand: "HangEase"
    },
    {
      name: "Bathroom Shelf Organizer",
      category: "Storage",
      sku: "STR-002",
      price: 250.00,
      quantity: 25,
      brand: "StackSmart"
    }
  ];

  for (const product of products) {
    const existing = await productRepo.findOneBy({ sku: product.sku });
    if (!existing) {
      const newProduct = productRepo.create(product);
      await productRepo.save(newProduct);
    }
  }

  console.log(" Seeded home supplies products successfully!");
};


seedProducts()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
