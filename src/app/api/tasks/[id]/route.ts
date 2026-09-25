import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/dbClient/prisma";

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((body) => Object.keys(body).length > 0);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json(task);
};

export const PATCH = async (request: Request, { params }: RouteContext) => {
  try {
    const body = updateTaskSchema.parse(await request.json());
    const { id } = await params;
    const task = await prisma.task.update({ where: { id }, data: body });

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid task update." }, { status: 400 });
    }

    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }
};

export const DELETE = async (_request: Request, { params }: RouteContext) => {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }
};
