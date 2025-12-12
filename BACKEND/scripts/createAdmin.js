// run with: node scripts/createAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const user = new User({ name: 'Admin', email: 'admin@example.com', password: 'password' });
    await user.save();
    console.log('Admin user created: admin@example.com / password');
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connect error:', err);
    process.exit(1);
  });
