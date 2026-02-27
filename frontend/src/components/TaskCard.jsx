import { useState } from "react";
import { updateTask, deleteTask } from "../api/api";

const STATUS = {
  pending:     { label: "Pending",     dot: "#f59e0b", color: "#92400e", bg: "#fef9ee", border: "#fde68a" },
  in_progress: { label: "In Progress", dot: "#3b82f6", color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  completed:   { label: "Completed",   dot: "#10b981", color: "#065f46", bg: "#f0fdf9", border: "#a7f3d0" },
};

const NEXT_STATUS = { pending: "in_progress", in_progress: "completed", completed: null };

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const inputStyle = {
  padding: "8px 11px",
  borderRadius: "8px",
  border: "1.5px solid #e2e8f0",
  fontSize: "13.5px",
  color: "#0f172a",
  outline: "none",
  backgroundColor: "#fafafa",
  fontFamily: "inherit",
  width: "100%",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const fieldFocus = (e) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.1)";
  e.target.style.backgroundColor = "#fff";
};
const fieldBlur = (e) => {
  e.target.style.borderColor     = "#e2e8f0";
  e.target.style.boxShadow       = "none";
  e.target.style.backgroundColor = "#fafafa";
};

export default function TaskCard({ task, onUpdated, onDeleted }) {
  const [status,        setStatus]        = useState(task.status);
  const [title,         setTitle]         = useState(task.title);
  const [description,   setDescription]   = useState(task.description || "");

  const [editing,       setEditing]       = useState(false);
  const [editTitle,     setEditTitle]     = useState(task.title);
  const [editDesc,      setEditDesc]      = useState(task.description || "");
  const [editStatus,    setEditStatus]    = useState(task.status);

  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error,         setError]         = useState("");
  const [hovered,       setHovered]       = useState(false);

  const cfg = STATUS[status] || STATUS.pending;
  const nextStatus = NEXT_STATUS[status];

  function openEdit() {
    setEditTitle(title);
    setEditDesc(description);
    setEditStatus(status);
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editTitle.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      await updateTask(task._id, editTitle.trim(), editDesc.trim(), editStatus);
      setTitle(editTitle.trim());
      setDescription(editDesc.trim());
      setStatus(editStatus);
      onUpdated(task._id, { title: editTitle.trim(), description: editDesc.trim(), status: editStatus });
      setEditing(false);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(newStatus) {
    if (newStatus === status || saving) return;
    const prev = status;
    setStatus(newStatus);
    setSaving(true);
    setError("");
    try {
      await updateTask(task._id, title, description, newStatus);
      onUpdated(task._id, { title, description, status: newStatus });
    } catch {
      setError("Failed to update.");
      setStatus(prev);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3500);
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await deleteTask(task._id);
      onDeleted(task._id);
    } catch {
      setError("Failed to delete.");
      setDeleting(false);
    }
  }

  const editCfg = STATUS[editStatus] || STATUS.pending;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        borderRadius: "14px",
        border: `1.5px solid ${editing ? "#a5b4fc" : hovered ? cfg.border : "#e2e8f0"}`,
        borderLeft: `4px solid ${editing ? "#6366f1" : cfg.dot}`,
        padding: "18px 20px",
        boxShadow: editing
          ? "0 4px 20px rgba(99,102,241,0.12)"
          : hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.18s ease",
        opacity: deleting ? 0.5 : 1,
      }}
    >
      {/* ── VIEW MODE ── */}
      {!editing && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
            <h3 style={{
              margin: 0,
              fontSize: "15.5px",
              fontWeight: "700",
              color: status === "completed" ? "#94a3b8" : "#0f172a",
              letterSpacing: "-0.3px",
              textDecoration: status === "completed" ? "line-through" : "none",
              flex: 1,
              minWidth: 0,
              wordBreak: "break-word",
            }}>
              {title}
            </h3>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "4px 10px", borderRadius: "20px",
              fontSize: "11.5px", fontWeight: "600",
              color: cfg.color, backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: cfg.dot, flexShrink: 0 }} />
              {cfg.label}
            </span>
          </div>

          {description && (
            <p style={{
              margin: "0 0 12px",
              fontSize: "13.5px", color: "#64748b", lineHeight: "1.6",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {description}
            </p>
          )}

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "8px",
            paddingTop: description ? "0" : "4px",
          }}>
            <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
              🗓 {formatDate(task.createdAt) || "—"}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              {/* Edit button */}
              <button
                onClick={openEdit}
                style={{
                  padding: "5px 12px", borderRadius: "7px",
                  border: "1.5px solid #e0e7ff", backgroundColor: "#eef2ff",
                  color: "#4f46e5", fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                }}
              >
                ✎ Edit
              </button>

              {/* Quick advance */}
              {nextStatus && (
                <button
                  onClick={() => changeStatus(nextStatus)}
                  disabled={saving}
                  style={{
                    padding: "5px 12px", borderRadius: "7px",
                    border: `1.5px solid ${STATUS[nextStatus].border}`,
                    backgroundColor: STATUS[nextStatus].bg,
                    color: STATUS[nextStatus].color,
                    fontSize: "12px", fontWeight: "600",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.6 : 1,
                    whiteSpace: "nowrap", transition: "opacity 0.1s",
                  }}
                >
                  {saving ? "Saving…" : `→ Mark ${STATUS[nextStatus].label}`}
                </button>
              )}

              {/* Status dropdown */}
              <select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                disabled={saving}
                style={{
                  padding: "5px 8px", borderRadius: "7px",
                  border: "1.5px solid #e2e8f0", fontSize: "12px",
                  color: "#374151", cursor: saving ? "not-allowed" : "pointer",
                  backgroundColor: "#f8fafc", outline: "none", fontFamily: "inherit",
                }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "5px 12px", borderRadius: "7px",
                  border: confirmDelete ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                  backgroundColor: confirmDelete ? "#fef2f2" : "#f8fafc",
                  color: confirmDelete ? "#dc2626" : "#94a3b8",
                  fontSize: "12px", fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.5 : 1,
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}
              >
                {deleting ? "Deleting…" : confirmDelete ? "Confirm?" : "Delete"}
              </button>

              {error && <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>⚠ {error}</span>}
            </div>
          </div>
        </>
      )}

      {/* ── EDIT MODE ── */}
      {editing && (
        <form onSubmit={handleSaveEdit}>
          {/* Edit header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "6px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", color: "#fff",
              }}>✎</div>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Edit Task</span>
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Created {formatDate(task.createdAt) || "—"}
            </span>
          </div>

          {/* Title + Status row */}
          <div className="taskedit-row">
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
                Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter task title"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Status preview badge */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "3px 10px", borderRadius: "20px",
              fontSize: "11.5px", fontWeight: "600",
              color: editCfg.color, backgroundColor: editCfg.bg,
              border: `1px solid ${editCfg.border}`,
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: editCfg.dot }} />
              {editCfg.label}
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
              Description
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: "72px", lineHeight: "1.5" }}
              onFocus={fieldFocus}
              onBlur={fieldBlur}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "7px 20px", borderRadius: "8px", border: "none",
                background: saving ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontSize: "13px", fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              style={{
                padding: "7px 16px", borderRadius: "8px",
                border: "1.5px solid #e2e8f0", backgroundColor: "#f8fafc",
                color: "#64748b", fontSize: "13px", fontWeight: "500",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            {error && <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>⚠ {error}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
