import dotenv from 'dotenv';

dotenv.config();

export const llm = () => {
    return process.env.openrouter;
};