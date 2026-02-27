import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask } from "../api/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const FILTERS = [
  { key: "all",         label: "All Tasks",  icon: "◈" },
  { key: "pending",     label: "Pending",    icon: "○" },
  { key: "in_progress", label: "In Progress",icon: "◑" },
  { key: "completed",   label: "Completed",  icon: "●" },
];

export default function Dashboard() {
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [filter,      setFilter]      = useState("all");
  const [showForm,    setShowForm]    = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchTasks();
  }, []);

  // close drawer on resize to desktop
  useEffect(() => {
    function onResize() { if (window.innerWidth > 768) setSidebarOpen(false); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  async function fetchTasks() {
    setLoading(true); setError("");
    try {
      const res = await getTasks();
      setTasks(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token"); navigate("/login");
      } else {
        setError("Failed to load tasks. Please try refreshing.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(title, description, status) {
    const res = await createTask(title, description, status);
    setTasks((prev) => [res.data?.data, ...prev]);
    setShowForm(false);
  }

  function handleUpdated(id, updatedFields) {
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t)));
  }

  function handleDeleted(id) {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function closeSidebar() { setSidebarOpen(false); }

  const counts = {
    all:         tasks.length,
    pending:     tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed:   tasks.filter((t) => t.status === "completed").length,
  };

  const completionPct = counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;
  const visibleTasks  = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", color: "#fff", fontWeight: "800", flexShrink: 0,
            }}>✓</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.4px" }}>TaskFlow</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>Task Manager</div>
            </div>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            onClick={closeSidebar}
            style={{
              display: "none",
              width: "28px", height: "28px", borderRadius: "7px",
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              color: "#64748b", fontSize: "16px", lineHeight: 1,
              alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
            className="sidebar-close-btn"
          >✕</button>
        </div>
      </div>

      {/* New Task button */}
      <div style={{ padding: "16px 16px 12px" }}>
        <button
          className="new-task-btn"
          onClick={() => { setShowForm((v) => !v); closeSidebar(); }}
          style={{
            width: "100%", padding: "10px 16px", borderRadius: "10px", border: "none",
            background: showForm
              ? "linear-gradient(135deg, #ef4444, #f87171)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", transition: "opacity 0.15s", letterSpacing: "-0.1px",
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: 1 }}>{showForm ? "✕" : "+"}</span>
          {showForm ? "Cancel" : "New Task"}
        </button>
      </div>

      {/* Overview */}
      <div style={{ padding: "4px 16px 12px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
          Overview
        </div>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", padding: "14px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Overall Progress</span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#6366f1" }}>{completionPct}%</span>
          </div>
          <div style={{ height: "6px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px",
              width: `${completionPct}%`,
              background: "linear-gradient(90deg, #6366f1, #10b981)",
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
            {counts.completed} of {counts.all} tasks done
          </div>
        </div>
      </div>

      {/* Nav filters */}
      <div style={{ padding: "4px 16px 12px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
          Filter
        </div>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className="sidebar-nav-btn"
            onClick={() => { setFilter(f.key); closeSidebar(); }}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "8px 10px",
              borderRadius: "8px", border: "none",
              backgroundColor: filter === f.key ? "#eef2ff" : "transparent",
              color: filter === f.key ? "#6366f1" : "#64748b",
              fontSize: "13.5px", fontWeight: filter === f.key ? "600" : "500",
              cursor: "pointer", marginBottom: "2px", textAlign: "left",
              transition: "background 0.12s",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>{f.icon}</span>
              {f.label}
            </span>
            <span style={{
              fontSize: "11px", fontWeight: "700",
              backgroundColor: filter === f.key ? "#6366f1" : "#e2e8f0",
              color: filter === f.key ? "#fff" : "#64748b",
              borderRadius: "99px", padding: "1px 7px",
              minWidth: "22px", textAlign: "center",
            }}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ marginTop: "auto", padding: "16px" }}>
        <button
          className="logout-btn"
          onClick={handleLogout}
          style={{
            width: "100%", padding: "9px 14px", borderRadius: "9px",
            border: "1.5px solid #e2e8f0", backgroundColor: "transparent",
            color: "#64748b", fontSize: "13.5px", fontWeight: "500", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "7px", transition: "all 0.15s",
          }}
        >
          <span>↩</span> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        /* show close button only on mobile */
        @media (max-width: 768px) {
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="dash-overlay" onClick={closeSidebar} />
        )}

        {/* ══ SIDEBAR ══ */}
        <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
          {sidebarContent}
        </aside>

        {/* ══ MAIN ══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Top bar */}
          <header className="dash-header" style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e2e8f0",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Hamburger — only visible on mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  display: "none",
                  width: "36px", height: "36px", borderRadius: "8px",
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  color: "#374151", fontSize: "18px", lineHeight: 1,
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  flexShrink: 0,
                }}
                className="hamburger-btn"
              >☰</button>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.4px" }}>
                {FILTERS.find((f) => f.key === filter)?.label}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="header-task-count" style={{ fontSize: "13px", color: "#94a3b8" }}>
                {visibleTasks.length} task{visibleTasks.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setShowForm((v) => !v)}
                style={{
                  padding: "7px 16px", borderRadius: "8px", border: "none",
                  background: showForm ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: showForm ? "#64748b" : "#fff",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "15px", lineHeight: 1 }}>{showForm ? "✕" : "+"}</span>
                {showForm ? "Cancel" : "New Task"}
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="dash-content" style={{ flex: 1, overflowY: "auto" }}>

            {/* New task form */}
            {showForm && (
              <div style={{
                backgroundColor: "#fff", border: "1.5px solid #e0e7ff",
                borderRadius: "16px", padding: "24px 28px", marginBottom: "24px",
                boxShadow: "0 4px 20px rgba(99,102,241,0.1)",
                animation: "fadeIn 0.2s ease",
              }}>
                <TaskForm onCreate={handleCreate} />
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    height: "96px", borderRadius: "14px",
                    backgroundColor: "#e2e8f0",
                    animation: "shimmer 1.4s ease-in-out infinite",
                  }} />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: "14px", padding: "24px", textAlign: "center",
                color: "#dc2626", fontSize: "14px", fontWeight: "500",
              }}>
                ⚠ {error}
                <button
                  onClick={fetchTasks}
                  style={{
                    display: "block", margin: "12px auto 0",
                    padding: "6px 16px", borderRadius: "7px",
                    border: "1.5px solid #fca5a5", backgroundColor: "#fff",
                    color: "#dc2626", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && visibleTasks.length === 0 && (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "60px 24px", backgroundColor: "#fff",
                borderRadius: "16px", border: "1.5px dashed #e2e8f0",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  {filter === "completed" ? "🎉" : filter === "pending" ? "📌" : filter === "in_progress" ? "⚡" : "📋"}
                </div>
                <p style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.3px", textAlign: "center" }}>
                  {filter === "all" ? "No tasks yet" : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} tasks`}
                </p>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px", textAlign: "center", maxWidth: "280px" }}>
                  {filter === "all"
                    ? "Create your first task using the New Task button."
                    : "Tasks will appear here once you assign them this status."}
                </p>
                {filter === "all" && (
                  <button
                    onClick={() => setShowForm(true)}
                    style={{
                      padding: "9px 22px", borderRadius: "9px", border: "none",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    + Create first task
                  </button>
                )}
              </div>
            )}

            {/* Task list */}
            {!loading && !error && visibleTasks.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {visibleTasks.map((task) => (
                  <div key={task._id} className="task-card-wrap">
                    <TaskCard task={task} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Show hamburger on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
