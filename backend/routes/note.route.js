import express from 'express';
import Note from '../models/note.model.js';
import Tenant from '../models/tenant.model.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a note (members & admins, enforce plan limit)
router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, content } = req.body;
    const tenantId = req.user.tenant;
    const userId = req.user._id;

    // Enforce plan limit
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    if (tenant.plan === 'free') {
      const noteCount = await Note.countDocuments({ tenant: tenantId });
      if (noteCount >= 3) {
        return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro for unlimited notes.' });
      }
    }

    const note = await Note.create({ title, content, tenant: tenantId, createdBy: userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all notes for the current tenant
router.get('/', protectRoute, async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenant });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a specific note (tenant isolation)
router.get('/:id', protectRoute, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a note (members & admins, tenant isolation)
// "message" : "Cast to ObjectId failed for value \":68ce747dc33e02ce363568fd\" (type string) at path \"_id\" for model \"Note\""

router.put('/:id', protectRoute, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenant },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a note (members & admins, tenant isolation)
router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.user.tenant });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;