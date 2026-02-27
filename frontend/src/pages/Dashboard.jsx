import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask } from "../api/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const STAT_CONFIG = [
  { key: "all",        label: "Total",       icon: "◈", color: "#6366f1", bg: "#eef2ff" },
  { key: "pending",    label: "Pending",     icon: "○", color: "#d97706", bg: "#fef3c7" },
  { key: "in_progress",label: "In Progress", icon: "◑", color: "#2563eb", bg: "#dbeafe" },
  { key: "completed",  label: "Done",        icon: "●", color: "#059669", bg: "#d1fae5" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      setTasks(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load tasks. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(title, description, status) {
    const res = await createTask(title, description, status);
    const newTask = res.data?.data;
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdated(id, newStatus) {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );
  }

  function handleDeleted(id) {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const visibleTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      {/* Top nav */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 24px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              color: "#fff",
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
            TaskFlow
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "7px 16px",
            borderRadius: "7px",
            border: "1.5px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            color: "#374151",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#ef4444";
            e.target.style.color = "#ef4444";
            e.target.style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.color = "#374151";
            e.target.style.backgroundColor = "#f8fafc";
          }}
        >
          Sign out
        </button>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 20px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.6px" }}>
            My Tasks
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {counts.all === 0
              ? "No tasks yet — create your first one below."
              : `${counts.completed} of ${counts.all} tasks completed.`}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {STAT_CONFIG.map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "14px 16px",
                borderRadius: "12px",
                border: filter === stat.key ? `2px solid ${stat.color}` : "2px solid transparent",
                backgroundColor: filter === stat.key ? stat.bg : "#fff",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "18px", marginBottom: "6px" }}>{stat.icon}</span>
              <span style={{ fontSize: "22px", fontWeight: "700", color: filter === stat.key ? stat.color : "#0f172a", lineHeight: 1, marginBottom: "4px" }}>
                {counts[stat.key]}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#64748b" }}>
                {stat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Create task form */}
        <TaskForm onCreate={handleCreate} />

        {/* Filter label */}
        {filter !== "all" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {STAT_CONFIG.find((s) => s.key === filter)?.label}
            </span>
            <button
              onClick={() => setFilter("all")}
              style={{ fontSize: "12px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}
            >
              Show all →
            </button>
          </div>
        )}

        {/* Task list */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>⟳</div>
            <p style={{ fontSize: "14px", margin: 0 }}>Loading tasks…</p>
          </div>
        )}

        {!loading && error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "16px",
            textAlign: "center",
            color: "#dc2626",
            fontSize: "14px",
          }}>
            ⚠ {error}
          </div>
        )}

        {!loading && !error && visibleTasks.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "52px 0",
            color: "#94a3b8",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>
              {filter === "completed" ? "🎉" : "📋"}
            </div>
            <p style={{ fontSize: "15px", margin: "0 0 4px", color: "#64748b", fontWeight: "500" }}>
              {filter === "all" ? "No tasks yet" : `No ${STAT_CONFIG.find((s) => s.key === filter)?.label.toLowerCase()} tasks`}
            </p>
            <p style={{ fontSize: "13px", margin: 0, color: "#94a3b8" }}>
              {filter === "all" ? "Use the form above to add your first task." : ""}
            </p>
          </div>
        )}

        {!loading && !error && visibleTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </main>
    </div>
  );
}
