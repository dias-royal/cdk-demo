import * as dotenv from 'dotenv'
import path = require('path');
import config from "../recording-analysis/config.json";

const env = `./env.${process.env.NODE_ENV}`
dotenv.config({path: path.resolve(__dirname, env)});

export type ConfigProps = {
    BRANCH: string,
    NODE_ENV: string,
    PROJECT_NAME: string
}

export const getConfig = (): ConfigProps => {
    return {
        BRANCH: process.env.BRANCH || '',
        NODE_ENV: process.env.NODE_ENV || '',
        PROJECT_NAME: config.project_config.project_name,
    }
}