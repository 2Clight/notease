import express from 'express';
import Tenant from '../models/tenant.model.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/tenants/:slug/upgrade (admin only)
router.post('/:slug/upgrade', protectRoute, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.plan = 'pro';
    await tenant.save();

    res.json({ message: 'Tenant upgraded to pro', tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;