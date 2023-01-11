declare global {
    namespace NodeJS {
      interface Global {}
      interface ProcessEnv {
        NODE_ENV: 'test' | 'development' | 'production';
  
        NEXTAUTH_SECRET: string;
        NEXTAUTH_URL: string;
        DATABASE_URL: string;
      }
    }
  }
  
  export {};
  