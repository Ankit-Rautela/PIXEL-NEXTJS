import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  priority: z.enum(["LOW", "MED", "HIGH"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedToId: z.string().optional(),
});

// ✅ GET /api/orders/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: { createdBy: true, assignedTo: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Access control: normal users can only see their own orders
  if (session.user.role === "USER" && order.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

// ✅ PATCH /api/orders/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.workOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Access control: normal users can only update their own orders
  if (session.user.role === "USER" && order.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data: any = {};

  if (session.user.role === "USER") {
    // ✅ Normal users: only these fields
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.description) data.description = parsed.data.description;
    if (parsed.data.priority) data.priority = parsed.data.priority;
  }

  if (session.user.role === "MANAGER") {
    // ✅ Managers: can update everything
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.description) data.description = parsed.data.description;
    if (parsed.data.priority) data.priority = parsed.data.priority;
    if (parsed.data.status) data.status = parsed.data.status;
    if (parsed.data.assignedToId) data.assignedToId = parsed.data.assignedToId;
  }

  const updated = await prisma.workOrder.update({
    where: { id },
    data,
    include: { createdBy: true, assignedTo: true },
  });

  return NextResponse.json(updated);
}
