import Env from "./Env";

export const isDevelopment = (): boolean => {
    return Env.string('NODE_ENV') === 'development';
}