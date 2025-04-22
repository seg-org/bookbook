import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!session.user.isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const params = await props.params;
  try {
    await prisma.generalReport.delete({ where: { id: params.id } });

    return NextResponse.json({ message: `Report with id ${params.id} deleted successfully` }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(`Error deleting report with id ${params.id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete report" }, { status: 500 });
  }
}
