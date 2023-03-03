declare global {
  namespace NodeJS {
    interface Global {}
    interface ProcessEnv {
      NODE_ENV: "test" | "development" | "production";

      AWS_LAMBDA_URL: string;
      AWS_LAMBDA_API_KEY: string;
      ELASTICSEARCH_URL: string;
      ELASTICSEARCH_INDEX: string;
      ELASTICSEARCH_API_KEY: string;
      SENTRY_AUTH_TOKEN?: string;
      SENTRY_DSN?: string;
    }
  }
}

export {};
