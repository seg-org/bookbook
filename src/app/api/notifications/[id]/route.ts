import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateNotificationRequest, MarkAsReadRequest, NotificationResponse, NotificationsResponse } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const validatedNotifications = NotificationsResponse.parse(notifications);

    return NextResponse.json(validatedNotifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedResult = CreateNotificationRequest.safeParse(body);

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.errors }, { status: 400 });
    }

    const { userId, message, link } = parsedResult.data;

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        link: link || null,
        isRead: false,
      },
    });

    const validatedNotification = NotificationResponse.safeParse(notification);

    if (!validatedNotification.success) {
      return NextResponse.json({ error: validatedNotification.error.errors }, { status: 500 });
    }

    return NextResponse.json(validatedNotification.data, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedResult = MarkAsReadRequest.safeParse(body);

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.errors }, { status: 400 });
    }

    const { id } = parsedResult.data;

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
