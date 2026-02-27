import { useState } from "react";

const focus = (e) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.1)";
  e.target.style.backgroundColor = "#fff";
};
const blur = (e) => {
  e.target.style.borderColor     = "#e2e8f0";
  e.target.style.boxShadow       = "none";
  e.target.style.backgroundColor = "#fafafa";
};

const inputBase = {
  padding: "9px 13px",
  borderRadius: "9px",
  border: "1.5px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
  outline: "none",
  backgroundColor: "#fafafa",
  fontFamily: "inherit",
  width: "100%",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export default function TaskForm({ onCreate }) {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [status,      setStatus]      = useState("pending");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required."); return; }
    setLoading(true);
    setError("");
    try {
      await onCreate(title.trim(), description.trim(), status);
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
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "7px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", color: "#fff", fontWeight: "700", flexShrink: 0,
        }}>+</div>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
          New Task
        </span>
      </div>

      {/* Row 1: Title + Status side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "5px" }}>
            Title <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputBase}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "5px" }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ ...inputBase, cursor: "pointer" }}
            onFocus={focus}
            onBlur={blur}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Row 2: Description */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "5px" }}>
          Description <span style={{ color: "#94a3b8", fontWeight: "500", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
        </label>
        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ ...inputBase, resize: "vertical", minHeight: "70px", lineHeight: "1.5" }}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      {/* Submit */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "9px 24px",
            borderRadius: "9px",
            border: "none",
            background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "-0.1px",
            transition: "opacity 0.15s",
          }}
        >
          {loading ? "Adding…" : "Add Task"}
        </button>
        {error && (
          <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>⚠ {error}</span>
        )}
      </div>
    </form>
  );
}
