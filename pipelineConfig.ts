import config from '../recording-analysis/config.json';

export interface ConfigProps {
  BRANCH: string;
  NODE_ENV: string;
  PROJECT_NAME: string;
  GIT_OWNER: string;
  GIT_REPO: string;
  GIT_TOKEN_NAME: string;
}

export const getConfig = (): ConfigProps => {
  return {
    BRANCH: process.env.BRANCH || 'development',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PROJECT_NAME: process.env.PROJECT_NAME || 'my-project',
    GIT_OWNER: process.env.GIT_OWNER || 'my-git-owner',
    GIT_REPO: process.env.GIT_REPO || 'my-git-repo',
    GIT_TOKEN_NAME: process.env.GIT_TOKEN_NAME || 'my-git-token-name',
  };
};