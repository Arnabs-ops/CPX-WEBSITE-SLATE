import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/dbClient/prisma";

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

const listTasksSchema = z.object({
  completed: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const query = listTasksSchema.safeParse(Object.fromEntries(url.searchParams));

  if (!query.success) {
    return NextResponse.json(
      {
        error: "Invalid query. Use completed=true|false and limit between 1 and 100.",
      },
      { status: 400 },
    );
  }

  const tasks = await prisma.task.findMany({
    where:
      query.data.completed === undefined
        ? undefined
        : { completed: query.data.completed },
    orderBy: { createdAt: "desc" },
    take: query.data.limit,
  });

  return NextResponse.json(tasks);
};

export const POST = async (request: Request) => {
  try {
    const body = createTaskSchema.parse(await request.json());
    const task = await prisma.task.create({ data: body });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Title must be between 1 and 200 characters." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Unable to create task." }, { status: 500 });
  }
};
