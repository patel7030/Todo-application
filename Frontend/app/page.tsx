"use client";
import { useCallback, useEffect, useState } from "react";

type Todo = {
  id: string;
  task: string;
  date?: string;
  status: "active" | "completed" | string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "all"
  ); // all | active | completed
  const [userId, setUserId] = useState<string | null>(null);

  // Read NEXT_PUBLIC_API_URL from env (available client-side) and normalize
  const rawApiBase = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const API_BASE = "https://todolistappbackend-production-7589.up.railway.app/"
    // rawApiBase.length > 0
    //   ? rawApiBase.replace(/\/+$/, "") // remove trailing slashes
    //   : "http://localhost:5000";

  // Generate or read unique user ID on first visit (client-only)

  console.log("API_BASE at runtime →", API_BASE);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let uid = localStorage.getItem("uid");
    if (!uid) {
      uid = `user-${Date.now()}`;
      localStorage.setItem("uid", uid);
    }
    setUserId(uid);
  }, []);

  // Load todos — safe, uses AbortController and checks userId
  const loadTodos = useCallback(
    async (status: string = "all", signal?: AbortSignal) => {
      if (!userId) return;
      try {
        let url = `${API_BASE}/todos?user_id=${encodeURIComponent(userId)}`;
        if (status !== "all") url += `&status=${encodeURIComponent(status)}`;

        const res = await fetch(url, { signal });
        if (!res.ok) {
          console.error("Failed to load todos:", res.statusText);
          return;
        }
        const data = await res.json();
        setTodos(data || []);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Error loading todos:", err);
      }
    },
    [userId, API_BASE]
  );

  // When userId becomes available, load todos
  useEffect(() => {
    const controller = new AbortController();
    if (userId) {
      loadTodos(filter, controller.signal);
    }
    return () => controller.abort();
  }, [userId, loadTodos, filter]);

  const addTodo = async () => {
    if (!task.trim() || !userId) return;

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task.trim(), user_id: userId }),
      });
      if (!res.ok) {
        console.error("Failed to add todo:", res.statusText);
      } else {
        setTask("");
        await loadTodos(filter);
      }
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_BASE}/todos/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await loadTodos(filter);
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  const completeTodo = async (id: string) => {
    try {
      await fetch(`${API_BASE}/todos/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      await loadTodos(filter);
    } catch (err) {
      console.error("Complete todo error:", err);
    }
  };

  const editTodo = async (id: string, oldTask: string) => {
    // prompt returns null if cancelled; ensure real string
    const newTask = prompt("Edit your task:", oldTask);
    if (newTask === null) return; // user cancelled
    const trimmed = newTask.trim();
    if (!trimmed) return;

    try {
      await fetch(`${API_BASE}/todos/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmed }),
      });
      await loadTodos(filter);
    } catch (err) {
      console.error("Edit todo error:", err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return todo.status === "active";
    if (filter === "completed") return todo.status === "completed";
    return true;
  });

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "32px",
        }}
      >
        📋 My To Do List
      </h1>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter todo"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
          fontSize: "18px",
        }}
      >
        {(["all", "active", "completed"] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <span
              key={tab}
              onClick={() => {
                setFilter(tab);
                // loadTodos will run automatically because filter is a dependency
              }}
              style={{
                cursor: "pointer",
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "#2563eb" : "red",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          );
        })}
      </div>

      {/* Todo Cards */}
      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          style={{
            background: "white",
            color: "black",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <b style={{ fontSize: "18px" }}>{todo.task}</b>

          <p style={{ margin: "5px 0", color: "#666" }}>{todo.date}</p>
          <p style={{ margin: "0 0 10px 0", color: "#444" }}>
            Status : {todo.status}
          </p>

          {/* --- BUTTONS IN ONE ROW --- */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {/* Edit + Complete only for ACTIVE */}
            {todo.status === "active" && (
              <>
                <button
                  onClick={() => editTodo(todo.id, todo.task)}
                  style={{
                    flex: 1,
                    background: "#2563eb",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => completeTodo(todo.id)}
                  style={{
                    flex: 1,
                    background: "green",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Completed
                </button>
              </>
            )}

            {/* DELETE always visible */}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                flex: 1,
                background: "red",
                color: "white",
                padding: "8px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* If no todos */}
      {filteredTodos.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No todos — try adding one.
        </p>
      )}
    </main>
  );
}
