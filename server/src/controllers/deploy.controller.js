import { cypherxService } from '../services/cypherx.service.js';
import { ApiError } from '../utils/ApiError.js';

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function deployFromGithub(req, res, next) {
  try {
    const { repoUrl, botName, description, nodeVersion, config } =
      req.body || {};

    if (!repoUrl || typeof repoUrl !== 'string' || !repoUrl.trim()) {
      throw new ApiError(400, 'repoUrl is required');
    }

    if (!isValidHttpUrl(repoUrl.trim())) {
      throw new ApiError(400, 'repoUrl must be a valid HTTP/HTTPS URL');
    }

    if (!botName || typeof botName !== 'string' || !botName.trim()) {
      throw new ApiError(400, 'botName is required');
    }

    if (config !== undefined && !Array.isArray(config)) {
      throw new ApiError(400, 'config must be an array of environment entries');
    }

    const payload = {
      repoUrl: repoUrl.trim(),
      botName: botName.trim(),
      ...(description !== undefined ? { description: String(description) } : {}),
      ...(nodeVersion !== undefined ? { nodeVersion: String(nodeVersion) } : {}),
      config: config ?? [],
    };

    const data = await cypherxService.deployFromGithub(payload);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function deployFromUpload(req, res, next) {
  try {
    const file = req.file;
    const { botName, description, nodeVersion, config } = req.body || {};

    if (!file) {
      throw new ApiError(400, 'ZIP file ("file") is required');
    }

    if (!botName || typeof botName !== 'string' || !botName.trim()) {
      throw new ApiError(400, 'botName is required');
    }

    let parsedConfig = config;
    if (typeof config === 'string' && config.trim()) {
      try {
        parsedConfig = JSON.parse(config);
      } catch {
        throw new ApiError(400, 'config must be valid JSON');
      }
    }

    const data = await cypherxService.deployFromUpload({
      file,
      botName: botName.trim(),
      description,
      nodeVersion,
      config: parsedConfig,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getDeploymentStatus(req, res, next) {
  try {
    const { deploymentId } = req.params;
    if (!deploymentId || !deploymentId.trim()) {
      throw new ApiError(400, 'deploymentId is required');
    }

    const data = await cypherxService.getDeploymentStatus(deploymentId.trim());
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

