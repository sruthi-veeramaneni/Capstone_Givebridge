const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters)');
    }

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/givebridge');

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name: 'GiveBridge Admin',
      email,
      phone: '9999999999',
      password: passwordHash,
      role: 'admin',
      verificationStatus: 'VERIFIED',
      city: 'Warangal',
      area: 'Main City',
      state: 'Telangana',
      pincode: '506001',
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [79.58, 18.0],
      },
    });

    console.log('Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
