import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const comments = await prisma.comment.findMany({ include: { blog: true } });
  return NextResponse.json(comments);
}

export async function DELETE(req: NextRequest) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  const data = await req.json();
  const comment = await prisma.comment.update({ where: { id }, data });
  return NextResponse.json(comment);
}