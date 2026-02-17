
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'nexstream_secret_key_pro';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // REGRA DE OURO: Bloqueio por Status
    if (!user.isActive) {
      return res.status(403).json({ error: 'Sua conta foi desativada. Contate o suporte.' });
    }

    // REGRA DE OURO: Bloqueio por Expiração
    const now = new Date();
    if (!user.isAdmin && user.expiresAt < now) {
      return res.status(403).json({ error: 'Sua assinatura expirou. Entre em contato com o administrador para renovar.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};

export const adminOnly = (req: any, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Acesso restrito apenas para administradores.' });
  }
  next();
};
