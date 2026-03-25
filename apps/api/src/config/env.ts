const DEFAULT_PORT = 3001;

export const env = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
};