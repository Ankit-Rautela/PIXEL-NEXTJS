"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "MED", status: "", assignedToId: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setForm({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          assignedToId: data.assignedToId || "",
        });
      });
  }, [id]);

  async function handleSave() {
    setError("");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
      setEditing(false);
      router.refresh(); // revalidate
    } else {
      const data = await res.json();
      setError(data.error?.message || "Update failed");
    }
  }

if (!order) {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

  const isManager = order.createdBy?.role === "MANAGER" || order.assignedTo?.role === "MANAGER";

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-xl font-semibold mb-4">Order Detail</h1>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      {editing ? (
        <form
          className="space-y-3"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required minLength={3} />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required minLength={5} />
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          {isManager && (
            <>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="label">Assign To (User ID)</label>
                <input className="input" value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: e.target.value }))} />
              </div>
            </>
          )}
          <button className="btn btn-secondary w-full" type="submit">Save</button>
        </form>
      ) : (
        <div className="space-y-2">
          <div><b>Title:</b> {order.title}</div>
          <div><b>Description:</b> {order.description}</div>
          <div><b>Priority:</b> {order.priority}</div>
          <div><b>Status:</b> {order.status}</div>
          <div><b>Created By:</b> {order.createdBy?.name}</div>
          <div><b>Assigned To:</b> {order.assignedTo?.name}</div>
          <button className="btn btn-secondary mt-4" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}