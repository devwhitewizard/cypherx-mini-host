import { cypherxService } from '../services/cypherx.service.js';

export async function getAccount(_req, res, next) {
  try {
    const data = await cypherxService.getAccount();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

