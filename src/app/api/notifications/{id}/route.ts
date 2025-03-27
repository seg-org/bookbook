import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fetch a specific notification by ID
export async function GET(req: NextRequest, props: { params: { id: string } }) {
  const { id } = props.params;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update a specific notification (e.g., mark as read)
export async function PATCH(req: NextRequest, props: { params: { id: string } }) {
  const { id } = props.params;

  try {
    const { isRead } = await req.json();

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete a specific notification
export async function DELETE(req: NextRequest, props: { params: { id: string } }) {
  const { id } = props.params;

  try {
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}