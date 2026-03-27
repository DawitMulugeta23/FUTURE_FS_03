const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("../models/User.model");
const Category = require("../models/Category.model");
const Menu = require("../models/Menu.model");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany();
    await Category.deleteMany();
    await Menu.deleteMany();

    console.log("🌱 Seeding admin user...");
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`✅ Admin created: ${admin.email}`);

    console.log("🌱 Seeding categories...");
    const categories = await Category.insertMany([
      {
        name: "Coffee",
        displayOrder: 1,
        description: "Fresh brewed coffee and espresso drinks",
      },
      { name: "Tea", displayOrder: 2, description: "Premium loose leaf teas" },
      { name: "Pastries", displayOrder: 3, description: "Fresh baked daily" },
      { name: "Sandwiches", displayOrder: 4, description: "Made to order" },
      {
        name: "Specials",
        displayOrder: 5,
        description: "Chef's special creations",
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    console.log("🌱 Seeding menu items...");
    const menuItems = [
      {
        name: "Espresso",
        category: categories[0]._id,
        price: 35,
        description: "Rich and bold single shot espresso",
        isVegetarian: true,
        isVegan: true,
        preparationTime: 5,
      },
      {
        name: "Cappuccino",
        category: categories[0]._id,
        price: 55,
        description: "Espresso with steamed milk and foam",
        isVegetarian: true,
        preparationTime: 7,
      },
      {
        name: "Latte",
        category: categories[0]._id,
        price: 60,
        description: "Smooth espresso with creamy steamed milk",
        isVegetarian: true,
        preparationTime: 7,
      },
      {
        name: "Ethiopian Coffee",
        category: categories[0]._id,
        price: 45,
        description: "Traditional Ethiopian coffee ceremony style",
        isVegetarian: true,
        isVegan: true,
        isSpecial: true,
        preparationTime: 15,
      },
      {
        name: "Butter Croissant",
        category: categories[2]._id,
        price: 40,
        description: "Flaky, buttery French croissant",
        isVegetarian: true,
        preparationTime: 3,
      },
      {
        name: "Chocolate Muffin",
        category: categories[2]._id,
        price: 45,
        description: "Rich chocolate muffin with chocolate chips",
        isVegetarian: true,
        preparationTime: 3,
      },
      {
        name: "Club Sandwich",
        category: categories[3]._id,
        price: 120,
        description: "Grilled chicken, bacon, lettuce, tomato on toasted bread",
        preparationTime: 15,
      },
      {
        name: "Vegan Wrap",
        category: categories[3]._id,
        price: 95,
        description: "Hummus, fresh vegetables, and avocado wrap",
        isVegetarian: true,
        isVegan: true,
        preparationTime: 10,
      },
      {
        name: "Iced Caramel Macchiato",
        category: categories[0]._id,
        price: 70,
        description: "Vanilla, caramel, espresso, and milk over ice",
        isVegetarian: true,
        isSpecial: true,
        preparationTime: 8,
      },
    ];

    await Menu.insertMany(menuItems);
    console.log(`✅ Created ${menuItems.length} menu items`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Login Credentials:");
    console.log(`   Admin Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`   Admin Password: ${process.env.ADMIN_PASSWORD}`);
    console.log("\n🍽️  Categories created:");
    categories.forEach((cat) => console.log(`   - ${cat.name}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
