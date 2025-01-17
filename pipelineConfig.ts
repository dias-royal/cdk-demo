import * as dotenv from 'dotenv'
import path = require('path');
import config from "../recording-analysis/config.json";

const env = `./env.${process.env.NODE_ENV}`
dotenv.config({path: path.resolve(__dirname, env)});

export type ConfigProps = {
    BRANCH: string,
    NODE_ENV: string,
    PROJECT_NAME: string,
    GIT_OWNER: string,
    GIT_REPO: string,
    GIT_TOKEN_NAME: string
}

export const getConfig = (): ConfigProps => {
    return {
        BRANCH: process.env.BRANCH || 'development',
        NODE_ENV: process.env.NODE_ENV || '',
        PROJECT_NAME: config.project_config.project_name,
        GIT_OWNER: config.project_config.git_owner,
        GIT_REPO: config.project_config.git_repo,
        GIT_TOKEN_NAME: config.project_config.git_token_name
    }
}