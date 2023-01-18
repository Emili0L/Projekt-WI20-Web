import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

// prisma.$use(async (params, next) => {
//   const before = Date.now()
//   const result = await next(params)
//   const after = Date.now()
//   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
//   return result
// })

export default prisma;
