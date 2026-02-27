import { useState } from "react";
import { updateTask, deleteTask } from "../api/api";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fcd34d",
    accent: "#f59e0b",
  },
  in_progress: {
    label: "In Progress",
    color: "#1e40af",
    bg: "#dbeafe",
    border: "#93c5fd",
    accent: "#3b82f6",
  },
  completed: {
    label: "Completed",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#6ee7b7",
    accent: "#10b981",
  },
};

export default function TaskCard({ task, onUpdated, onDeleted }) {
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    const prev = status;
    setStatus(newStatus);
    setLoading(true);
    setError("");
    try {
      await updateTask(task._id, task.title, task.description, newStatus);
      onUpdated(task._id, newStatus);
    } catch {
      setError("Failed to update.");
      setStatus(prev);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await deleteTask(task._id);
      onDeleted(task._id);
    } catch {
      setError("Failed to delete.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${cfg.accent}`,
        padding: "16px 18px",
        marginBottom: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: "12px" }}>
          <h3
            style={{
              margin: "0 0 4px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#0f172a",
              letterSpacing: "-0.2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13.5px",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </p>
          )}
        </div>

        <span
          style={{
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11.5px",
            fontWeight: "600",
            color: cfg.color,
            backgroundColor: cfg.bg,
            border: `1px solid ${cfg.border}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
            letterSpacing: "0.1px",
          }}
        >
          {cfg.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={loading}
          style={{
            padding: "6px 10px",
            borderRadius: "7px",
            border: "1.5px solid #e2e8f0",
            fontSize: "13px",
            color: "#374151",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#f8fafc",
            outline: "none",
            fontFamily: "inherit",
          }}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "6px 14px",
            borderRadius: "7px",
            border: confirmDelete ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
            backgroundColor: confirmDelete ? "#fef2f2" : "#f8fafc",
            color: confirmDelete ? "#dc2626" : "#64748b",
            fontSize: "13px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {confirmDelete ? "Confirm delete?" : "Delete"}
        </button>

        {error && (
          <span style={{ fontSize: "12px", color: "#ef4444" }}>⚠ {error}</span>
        )}
      </div>
    </div>
  );
}
