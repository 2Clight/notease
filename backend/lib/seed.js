import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'; 
import Tenant from '../models/tenant.model.js';
import dotenv from 'dotenv';

dotenv.config();


async function seed() {
  await mongoose.connect(process.env.MONGO_URI); 

  // Ensure tenants exist
  const tenants = {};
  for (const name of ['Acme', 'Globex']) {
    const slug = name.toLowerCase();
    let tenant = await Tenant.findOne({ name });
    if (!tenant) tenant = await Tenant.create({ name, slug });
    tenants[name] = tenant._id;
  }

  // Users to create
  const users = [
    { email: 'admin@acme.test', name: 'Acme Admin', role: 'admin', tenant: tenants['Acme'] },
    { email: 'user@acme.test', name: 'Acme User', role: 'member', tenant: tenants['Acme'] },
    { email: 'admin@globex.test', name: 'Globex Admin', role: 'admin', tenant: tenants['Globex'] },
    { email: 'user@globex.test', name: 'Globex User', role: 'member', tenant: tenants['Globex'] },
  ];

  for (const user of users) {
  const exists = await User.findOne({ email: user.email });
  const hashedPassword = await bcrypt.hash('password', 10);
  if (!exists) {
    await User.create({ ...user, password: hashedPassword });
    console.log(`Created: ${user.email}`);
  } else {
    exists.password = hashedPassword; // reset password
    exists.tenant = user.tenant; // ensure tenant is set
    await exists.save();
    console.log(`Updated: ${user.email}`);
  }
}

  mongoose.disconnect();
}

seed();