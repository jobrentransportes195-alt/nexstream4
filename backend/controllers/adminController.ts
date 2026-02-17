
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  const { name, username, password, days } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cálculo da data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(days));

    const newUser = new UserModel({
      name,
      username,
      password: hashedPassword,
      expiresAt,
      credits: Math.ceil(days / 30),
      isActive: true
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find({ isAdmin: false }).select('-password');
  res.json(users);
};
