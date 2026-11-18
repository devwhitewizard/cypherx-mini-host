export interface EnvVarEntry {
  key: string;
  value: string;
}

export interface GithubDeployPayload {
  repoUrl: string;
  botName: string;
  description?: string;
  nodeVersion?: string;
  config?: EnvVarEntry[];
}

export interface ZipDeployPayload {
  file: File;
  botName: string;
  description?: string;
  nodeVersion?: string;
  config?: EnvVarEntry[];
}

export interface DeploymentResponse {
  deploymentId?: string;
  id?: string;
  botId?: string;
  status?: string;
  message?: string;
  progress?: number;
  logs?: string | string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

