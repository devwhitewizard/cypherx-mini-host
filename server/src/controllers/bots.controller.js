import { cypherxService } from '../services/cypherx.service.js';
import { ApiError } from '../utils/ApiError.js';

function requireBotId(id) {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new ApiError(400, 'Bot id is required');
  }
  return id.trim();
}

function parseLinesQuery(rawLines) {
  if (rawLines === undefined || rawLines === '') {
    return 100;
  }

  const parsed = Number(rawLines);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10000) {
    throw new ApiError(
      400,
      'Query parameter "lines" must be an integer between 1 and 10000'
    );
  }
  return parsed;
}

export async function getBots(_req, res, next) {
  try {
    const data = await cypherxService.getBots();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getBotById(req, res, next) {
  try {
    const botId = requireBotId(req.params.id);
    const data = await cypherxService.getBotById(botId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getBotLogs(req, res, next) {
  try {
    const botId = requireBotId(req.params.id);
    const lines = parseLinesQuery(req.query.lines);
    const data = await cypherxService.getBotLogs(botId, lines);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function restartBot(req, res, next) {
  try {
    const botId = requireBotId(req.params.id);
    const data = await cypherxService.restartBot(botId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function stopBot(req, res, next) {
  try {
    const botId = requireBotId(req.params.id);
    const data = await cypherxService.stopBot(botId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function deleteBot(req, res, next) {
  try {
    const botId = requireBotId(req.params.id);
    const data = await cypherxService.deleteBot(botId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

