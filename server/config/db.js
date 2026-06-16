const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    await createDefaultAdmin();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

async function createDefaultAdmin() {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  const existing = await User.findOne({ role: "admin" });
  if (existing) return; // admin already exists, skip

  const password = await bcrypt.hash("Admin@123", 10);
  await User.create({
    name: "Admin",
    email: "admin@mediconnect.com",
    password,
    role: "admin",
    isActive: true,
  });

  console.log("✅ Default admin created → email: admin@mediconnect.com | password: Admin@123");
}

module.exports = connectDB;
