"use client";
import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      search,
      status,
      priority
    });
    fetch(`/api/orders?${params}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders);
        setTotal(data.total);
      });
  }, [page, search, status, priority]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Search title/description"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="input">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="input">
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MED">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created By</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td>{order.title}</td>
              <td>{order.description}</td>
              <td>{order.status}</td>
              <td>{order.priority}</td>
              <td>{order.createdBy?.name}</td>
              <td>{order.assignedTo?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <button
          className="btn"
          disabled={page * pageSize >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}