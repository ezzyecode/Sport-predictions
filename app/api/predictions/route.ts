import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId, prediction } = await req.json();

  try {
    const newPrediction = await prisma.prediction.create({
      data: {
        userId: session.user.id,
        matchId,
        prediction,
      },
    });

    return NextResponse.json(newPrediction);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const predictions = await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(predictions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 });
  }
}