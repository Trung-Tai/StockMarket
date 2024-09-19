import { NextRequest } from "next/server";
import { GET } from "@/app/api/quoteGroup/route";
import prisma from "@/lib/prisma";

interface Group {
  id: number;
  name: string;
}

describe("API Route: /api/quoteGroup", () => {
  beforeAll(async () => {
    try {
      await prisma.$connect();

      const existingGroup = await prisma.group.findUnique({
        where: { name: "Test Group" },
      });

      if (!existingGroup) {
        await prisma.group.create({
          data: {
            name: "Test Group",
          },
        });
      }
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  afterAll(async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error during teardown:", error);
    }
  });

  test("should retrieve groups", async () => {
    const req = new NextRequest("http://localhost/api/quoteGroup");
    const response = await GET(req);

    const groups: Group[] = await response.json();

    console.log(groups);
    expect(response.status).toBe(200);
    expect(groups.some((group) => group.name === "Test Group")).toBe(true);
  });
});
