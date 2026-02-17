
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Armazenado com bcrypt
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', UserSchema);
