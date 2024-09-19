import "@testing-library/jest-dom";
import { PrismaClient } from "@prisma/client";

global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$transaction(async (prisma) => {
    await prisma.$executeRaw`BEGIN TRANSACTION`;
  });
});

afterEach(async () => {
  await prisma.$transaction(async (prisma) => {
    await prisma.$executeRaw`ROLLBACK TRANSACTION`;
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
