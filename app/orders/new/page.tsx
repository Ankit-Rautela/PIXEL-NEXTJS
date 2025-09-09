// /app/orders/new/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { orderSchema, OrderInput } from "@/lib/orderSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Create Order",
};

async function createOrder(formData: FormData) {
  "use server";

  // collect values
  const title = formData.get("title");
  const description = formData.get("description");
  const priority = formData.get("priority");

  // basic type checks (FormData values are FormDataEntryValue | null)
  const payload = {
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : "",
    priority: typeof priority === "string" ? priority : "MED",
  };

  // validate with Zod
  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    // Throwing allows Next.js to show an error in dev; in prod you may want to handle differently
    // You can also set up an error UI (by returning) but throwing is fine for simple flows.
    throw new Error("Validation failed: " + JSON.stringify(parsed.error.issues));
  }

  const session = await getServerSession();
  if (!session?.user) {
    // If no session, redirect to login (or throw)
    redirect("/api/auth/signin"); // adjust to your auth route
  }

  // create the work order
  await prisma.workOrder.create({
    data: {
      ...parsed.data as OrderInput,
      status: "OPEN", // default status
      createdById: session.user.id,
    },
  });

  // revalidate the orders list so /orders shows fresh data
  revalidatePath("/orders");

  // finally redirect back to list
  redirect("/orders");
}

export default function NewOrderPage() {
  // This is a Server Component page that renders a classic html <form> which posts to the server action.
  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-xl font-semibold mb-4">Create Order</h1>

      {/* form posts to the server action 'createOrder' */}
      <form action={createOrder} className="space-y-3">
        <div>
          <label className="label">Title</label>
          <input name="title" className="input" required minLength={3} />
        </div>

        <div>
          <label className="label">Description</label>
          <input name="description" className="input" required minLength={3} />
        </div>

        <div>
          <label className="label">Priority</label>
          <select name="priority" className="input" defaultValue="MED">
            <option value="LOW">Low</option>
            <option value="MED">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <button className="btn btn-secondary w-full" type="submit">Create</button>
      </form>
    </div>
  );
}
