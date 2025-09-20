import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g. 'acme', 'globex'
  plan: { type: String, enum: ['free', 'pro'], default: 'free' }
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
