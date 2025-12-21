import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import { apiURL } from "../apiURL";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiURL}/orders`);
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.username?.toLowerCase().includes(search.toLowerCase()) ||
      order.order_id.toString().includes(search)
  );

  const handleSave = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(`${apiURL}/orders/${selectedOrder.order_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: selectedOrder.order_status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, order_status: selectedOrder.order_status }
            : order
        )
      );

      setSelectedOrder(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const res = await fetch(`${apiURL}/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order.order_id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Admin — Manage Orders</h2>

        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search orders..."
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{order.username}</td>
                      <td>{order.created_at}</td>
                      <td>${Number(order.total_amount).toFixed(2)}</td>

                      <td>
                        {order.order_status === "Paid" && (
                          <span className="badge bg-success">Paid</span>
                        )}
                        {order.order_status === "Pending" && (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}
                        {order.order_status === "Cancelled" && (
                          <span className="badge bg-danger">Cancelled</span>
                        )}
                        {order.order_status !== "Paid" &&
                          order.order_status !== "Pending" &&
                          order.order_status !== "Cancelled" && (
                            <span className="badge bg-secondary">
                              {order.order_status}
                            </span>
                          )}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#viewOrderModal"
                          onClick={() => setSelectedOrder({ ...order })}
                        >
                          View / Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(order.order_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="viewOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Order Details</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => setSelectedOrder(null)}
              ></button>
            </div>

            <div className="modal-body">
              {selectedOrder && (
                <>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.order_id}
                  </p>
                  <p>
                    <strong>User:</strong> {selectedOrder.username}
                  </p>
                  <p>
                    <strong>Total:</strong> ${selectedOrder.total_amount}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedOrder.created_at}
                  </p>

                  <hr />

                  <label className="form-label">Order Status</label>
                  <select
                    className="form-select"
                    value={selectedOrder.order_status}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        order_status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
