export type BotStatus =
  | 'running'
  | 'online'
  | 'stopped'
  | 'offline'
  | 'restarting'
  | 'deploying'
  | 'building'
  | 'error'
  | 'failed'
  | string;

export interface BotRuntimeStats {
  uptime?: string | number;
  cpu?: string | number;
  memory?: string | number;
  nodeVersion?: string;
  [key: string]: unknown;
}

export interface Bot {
  id: string;
  _id?: string;
  name?: string;
  botName?: string;
  description?: string;
  status?: BotStatus;
  nodeVersion?: string;
  runtime?: BotRuntimeStats;
  uptime?: string | number;
  cpu?: string | number;
  memory?: string | number;
  repoUrl?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
  lastDeployedAt?: string;
  [key: string]: unknown;
}

export interface BotLogsResponse {
  logs?: string | string[];
  lines?: string[];
  data?: string | string[] | { logs?: string | string[] };
  [key: string]: unknown;
}

