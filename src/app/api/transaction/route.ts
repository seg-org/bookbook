import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
    return NextResponse.json({ msg : "Hi"}, {status : 200})
}