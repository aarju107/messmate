import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    unique: true, // one menu per day (stored at UTC midnight)
  },
  breakfast: {
    type: String,
    required: [true, 'Please provide breakfast'],
  },
  lunch: {
    type: String,
    required: [true, 'Please provide lunch'],
  },
  snacks: {
    type: String,
    required: [true, 'Please provide snacks'],
  },
  dinner: {
    type: String,
    required: [true, 'Please provide dinner'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema);

export default Menu;