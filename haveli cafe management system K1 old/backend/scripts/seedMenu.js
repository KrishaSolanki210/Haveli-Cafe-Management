const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../config/db");
const MenuItem = require("../models/MenuItem");

const menuItems = [
  {
    name: "Masala Chai",
    description: "Traditional Indian tea brewed with ginger, cardamom, and milk.",
    category: "Beverages",
    price: 40,
    preparationTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cold Coffee",
    description: "Creamy chilled coffee topped with froth and chocolate drizzle.",
    category: "Cold Drinks",
    price: 120,
    preparationTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Fresh Lime Soda",
    description: "Refreshing sweet and salted lime soda.",
    category: "Cold Drinks",
    price: 90,
    preparationTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Mango Shake",
    description: "Thick mango shake made with fresh pulp and chilled milk.",
    category: "Cold Drinks",
    price: 130,
    preparationTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "French Fries",
    description: "Golden crispy fries served with tomato dip.",
    category: "Snacks",
    price: 110,
    preparationTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Veg Sandwich",
    description: "Loaded grilled sandwich with fresh vegetables and house spread.",
    category: "Snacks",
    price: 140,
    preparationTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Paneer Tikka Wrap",
    description: "Soft wrap stuffed with smoky paneer tikka and mint mayo.",
    category: "Snacks",
    price: 170,
    preparationTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Samosa Platter",
    description: "Two crispy samosas served with green chutney and imli sauce.",
    category: "Snacks",
    price: 80,
    preparationTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella, basil, and rich tomato sauce.",
    category: "Main Course",
    price: 260,
    preparationTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Paneer Butter Masala",
    description: "Creamy tomato gravy with soft paneer cubes and butter finish.",
    category: "Main Course",
    price: 240,
    preparationTime: 22,
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Veg Hakka Noodles",
    description: "Wok-tossed noodles with crunchy vegetables and soy seasoning.",
    category: "Main Course",
    price: 190,
    preparationTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1617622141573-b5c6dca9659a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cheese Burger",
    description: "Toasted bun filled with crispy veg patty and molten cheese.",
    category: "Main Course",
    price: 180,
    preparationTime: 16,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie served with fudge texture.",
    category: "Desserts",
    price: 110,
    preparationTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Gulab Jamun",
    description: "Soft syrup-soaked gulab jamuns served warm.",
    category: "Desserts",
    price: 90,
    preparationTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1605197161470-5b0f1b9b9c58?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ice Cream Sundae",
    description: "Vanilla and chocolate ice cream with nuts and syrup.",
    category: "Desserts",
    price: 150,
    preparationTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
  },
];

const seedMenu = async () => {
  try {
    await connectDB();

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);

    console.log("Sample menu seeded successfully.");
    console.log(
      "Categories added:",
      [...new Set(menuItems.map((item) => item.category))].join(", ")
    );
  } catch (error) {
    console.error("Failed to seed menu:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedMenu();
