import { faker as Faker } from "@faker-js/faker";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { connectDB } from "../src/db/mongoose.js";

const productCategories = {
  Electronics: ["Smartphones", "Laptops", "Headphones", "Cameras"],
  Fashion: ["Clothing", "Shoes", "Accessories", "Jewelry"],
  "Home & Garden": ["Furniture", "Decor", "Kitchen", "Bedding"],
  Sports: ["Fitness", "Outdoor", "Team Sports", "Athletic Wear"],
  Books: ["Fiction", "Non-Fiction", "Educational", "Comics"],
};

function generateFakeProducts() {
  const mainCategory = Faker.helpers.arrayElement(
    Object.keys(productCategories),
  );
  const subCats = productCategories[mainCategory];
  const selectedSubCats = Faker.helpers.arrayElements(
    subCats,
    Faker.number.int({ min: 1, max: 2 }),
  );

  let priceRange = { min: 5000, max: 50000 };
  if (mainCategory === "Electronics") {
    priceRange = { min: 20000, max: 500000 };
  } else if (mainCategory === "Fashion") {
    priceRange = { min: 3000, max: 100000 };
  }

  const price = Faker.number.float({ ...priceRange, precision: 100 });
  const costPrice =
    price * Faker.number.float({ min: 0.45, max: 0.65, precision: 0.01 });
  const hasSale = Faker.datatype.boolean({ probability: 0.3 }); // 30% chance of sale
  const salePrice = hasSale
    ? price * Faker.number.float({ min: 0.65, max: 0.85, precision: 0.01 })
    : null;

  const quantity = Faker.number.int({ min: 0, max: 300 });
  const isInStock = quantity > 0;

  let productName = "";
  switch (mainCategory) {
    case "Electronics":
      productName = `${Faker.company.name()} ${Faker.commerce.productName()}`;
      break;
    case "Fashion":
      productName = `${Faker.commerce.productAdjective()} ${Faker.commerce.product()}`;
      break;
    default:
      productName = Faker.commerce.productName();
  }

  const commonTags = ["trending", "new-arrival", "bestseller", "featured"];
  const saleTags = hasSale ? ["sale", "discount"] : [];
  const stockTags = quantity < 10 && quantity > 0 ? ["limited-stock"] : [];
  const allTags = [...commonTags, ...saleTags, ...stockTags];

  const selectedTags = Faker.helpers.arrayElements(
    allTags,
    Faker.number.int({ min: 2, max: 4 }),
  );

  return {
    name: productName,
    description: {
      fullDescription: `${Faker.commerce.productDescription()}. ${Faker.lorem.paragraph()} ${Faker.lorem.paragraph()}`,
      shortDescription: Faker.commerce.productDescription(),
    },
    pricing: {
      price: Math.round(price),
      salePrice: salePrice ? Math.round(salePrice) : null,
      currency: "NGN",
      costPrice: Math.round(costPrice),
    },
    stock: {
      quantity: quantity,
      isInStock: isInStock,
      lowStockThreshold: Faker.number.int({ min: 10, max: 25 }),
    },
    media: {
      images: [
        "https://res.cloudinary.com/dvjdd994c/image/upload/v1769287811/products/images/vk25ze9qip3czxfplm9i.jpg",
        "https://res.cloudinary.com/dvjdd994c/image/upload/v1769287820/products/images/r6zzsx56qtxbhcabbd3l.jpg",
      ],
      thumbnail:
        "https://res.cloudinary.com/dvjdd994c/image/upload/v1769287809/products/thumbnails/e40vzg5jjp5x92fj9mrf.jpg",
    },
    category: {
      tags: selectedTags,
    },
    rating: Faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
    reviewCount: Faker.number.int({ min: 0, max: 1000 }),
  };
}

async function seedProducts(count = 50) {
  try {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(generateFakeProducts());
    }
    // insert many at once (ensures we await DB operation)
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${result.length} products`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}


(async () => {
  try {
    await connectDB();
    await seedProducts(100);
  } catch (err) {
    console.error("Seeder failed:", err);
  } finally {
    await mongoose.connection.close();
  }
})();
