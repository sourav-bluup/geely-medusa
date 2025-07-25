import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

module.exports = defineConfig({
  projectConfig: {
    redisUrl: REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
   /* // @ts-expect-error - this is a valid path */
    //path: process.env.MEDUSA_ADMIN_PATH || '/admin',
  },
  modules: [
    {
      resolve: '@medusajs/medusa/cache-redis',
      options: {
        redisUrl: REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: REDIS_URL,
        },
      },
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // other options...
            },
          },
        ],
      },
    },
    {
      resolve: './modules/vehicle',
    },
    {
      resolve: './modules/sanity',
      options: {
        api_token: process.env.SANITY_TOKEN,
        project_id: process.env.SANITY_PROJECT_ID,
        api_version: '2024-07-05',
        dataset: process.env.SANITY_DATASET,
        studio_url: 'https://geely-next.vercel.app/studio',
        type_map: {
          collection: 'collection',
          category: 'category',
          product: 'product',
        },
      },
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: './src/modules/ngenius-payment',
            id: 'ng',
            options: {
              apiKey: process.env.NGENIUS_API_KEY,
              outletId: process.env.NGENIUS_OUTLET_ID,
              apiUrl: process.env.NGENIUS_API_URL,
            },
          },
        ],
      },
    },
  ],
});
