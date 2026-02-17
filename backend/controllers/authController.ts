
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'nexstream_secret_key_pro';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        expiresAt: user.expiresAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
