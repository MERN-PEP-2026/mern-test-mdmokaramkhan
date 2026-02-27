import { useState } from "react";

const s = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  headerIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    color: "#fff",
    flexShrink: 0,
  },
  headerText: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.2px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginBottom: "12px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#fafafa",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#fafafa",
    resize: "vertical",
    fontFamily: "inherit",
    minHeight: "72px",
  },
  select: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "4px",
  },
  submitBtn: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "-0.1px",
    flexShrink: 0,
  },
  errorText: {
    fontSize: "13px",
    color: "#dc2626",
  },
};

const focusStyle = (e) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
  e.target.style.backgroundColor = "#fff";
};
const blurStyle = (e) => {
  e.target.style.borderColor = "#e2e8f0";
  e.target.style.boxShadow = "none";
  e.target.style.backgroundColor = "#fafafa";
};

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onCreate(title, description, status);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch {
      setError("Failed to create task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.headerIcon}>+</div>
        <span style={s.headerText}>New Task</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={s.input}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={s.select}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div style={s.fieldFull}>
          <label style={s.label}>Description</label>
          <textarea
            placeholder="Add details (optional)…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={s.textarea}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        <div style={s.footer}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Adding…" : "Add Task"}
          </button>
          {error && <span style={s.errorText}>⚠ {error}</span>}
        </div>
      </form>
    </div>
  );
}
