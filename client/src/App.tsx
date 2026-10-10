import { useEffect, useState, type FormEvent } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import {
  setSubjects as saveSubjects,
  setTasks as saveTasks,
  setSessions as saveSessions,
} from "./store/plannerSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
CartesianGrid,
} from "recharts";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [page, setPage] = useState("dashboard");
const dispatch = useDispatch();

const subjects = useSelector(
  (state: RootState) => state.planner.subjects
);

const setSubjects = (
  items: RootState["planner"]["subjects"]
) => {
  dispatch(saveSubjects(items));
};
const [newSubject, setNewSubject] = useState("");
const tasks = useSelector(
  (state: RootState) => state.planner.tasks
);

const setTasks = (
  items: RootState["planner"]["tasks"]
) => {
  dispatch(saveTasks(items));
};
const [newTask, setNewTask] = useState("");
const sessions = useSelector(
  (state: RootState) => state.planner.sessions
);
const chartData = [
  { name: "Subjects", total: subjects.length },
  { name: "Tasks", total: tasks.length },
  { name: "Sessions", total: sessions.length },
];
const setSessions = (
  items: RootState["planner"]["sessions"]
) => {
  dispatch(saveSessions(items));
};

const [newSessionTitle, setNewSessionTitle] = useState("");
const [newSessionDate, setNewSessionDate] = useState("");
const [newSessionDuration, setNewSessionDuration] = useState("");
useEffect(() => {
  if (!isLoggedIn) return;
  const loadSubjects = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/subjects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setSubjects(data.data);
    }
  };
const loadTasks = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (response.ok) {
    setTasks(data.data);
  }
};
const loadSessions = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/sessions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.ok) {
    setSessions(data.data);
  }
};
  loadSubjects();
  loadTasks();
  loadSessions();
}, [isLoggedIn]);
const handleAddSession = async (event: FormEvent) => {
  event.preventDefault();

  if (
    !newSessionTitle.trim() ||
    !newSessionDate ||
    !newSessionDuration
  ) {
    return;
  }

  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newSessionTitle,
        sessionDate: newSessionDate,
        durationMinutes: Number(newSessionDuration),
      }),
    }
  );

  if (response.ok) {
    const sessionsResponse = await fetch(
      "http://localhost:5000/api/sessions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const sessionsData = await sessionsResponse.json();
    setSessions(sessionsData.data);

    setNewSessionTitle("");
    setNewSessionDate("");
    setNewSessionDuration("");
  }
};
const handleDeleteSession = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/sessions/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    setSessions(
      sessions.filter((session) => session.id !== id)
    );
  }
};
const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);
  setPage("dashboard");
  setMessage("");
};
const handleAddTask = async (event: FormEvent) => {
  event.preventDefault();

  if (!newTask.trim()) return;

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newTask,
    }),
  });

  if (response.ok) {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        status: "pending"
      },
    ]);

    setNewTask("");
  }
};
const handleCompleteTask = async (task: {
  id: number;
  title: string;
  status: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/tasks/${task.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title,
        status: "completed",
      }),
    }
  );

  if (response.ok) {
    setTasks(
      tasks.map((item) =>
        item.id === task.id
          ? { ...item, status: "completed" }
          : item
      )
    );
  }
};
const handleDeleteTask = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/tasks/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    setTasks(tasks.filter((task) => task.id !== id));
  }
};
const handleAddSubject = async (event: FormEvent) => {
  event.preventDefault();

  if (!newSubject.trim()) return;

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: newSubject,
      color: "#4f46e5",
    }),
  });

  if (response.ok) {
    setSubjects([
      ...subjects,
      { id: Date.now(), name: newSubject, color: "#4f46e5" },
    ]);
    setNewSubject("");
  }
};
const handleDeleteSubject = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/subjects/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  }
};
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
    } catch {
      setMessage("Cannot connect to the server");
    } finally {
      setLoading(false);
    }
  };
  if (isLoggedIn && page === "subjects") {
  return (
    <main className="dashboard">
      <h1>Subjects</h1>
      <form className="subject-form" onSubmit={handleAddSubject}>
  <input
    type="text"
    value={newSubject}
    onChange={(event) => setNewSubject(event.target.value)}
    placeholder="Enter subject name"
    required
  />
  <button type="submit">Add Subject</button>
</form>
      <div className="subjects-list">
  {subjects.map((subject) => (
    <div className="subject-item" key={subject.id}>
      <h2>{subject.name}</h2>
      <button onClick={() => handleDeleteSubject(subject.id)}>
  Delete
</button>
    </div>
  ))}
</div>
      <button onClick={() => setPage("dashboard")}>Back</button>
    </main>
  );
}
if (isLoggedIn && page === "tasks") {
  return (
    <main className="dashboard">
      <h1>Tasks</h1>
      <form className="subject-form" onSubmit={handleAddTask}>
  <input
    type="text"
    value={newTask}
    onChange={(event) => setNewTask(event.target.value)}
    placeholder="Enter task title"
    required
  />

  <button type="submit">Add Task</button>
</form>
     <div className="subjects-list">
  {tasks.map((task) => (
    <div className="subject-item" key={task.id}>
      <h2>{task.title}</h2>
      <p>{task.status === "completed" ? "Completed" : "Not completed"}</p>
 <button onClick={() => handleCompleteTask(task)}>
  Complete
</button>

<button onClick={() => handleDeleteTask(task.id)}>
  Delete
</button>
    </div>
  ))}
</div>

      <button onClick={() => setPage("dashboard")}>
        Back
      </button>
    </main>
  );
}
if (isLoggedIn && page === "sessions") {
  return (
    <main className="dashboard">
      <h1>Study Sessions</h1>

      <form className="subject-form" onSubmit={handleAddSession}>
        <input
          type="text"
          value={newSessionTitle}
          onChange={(event) =>
            setNewSessionTitle(event.target.value)
          }
          placeholder="Session title"
          required
        />

        <input
          type="date"
          value={newSessionDate}
          onChange={(event) =>
            setNewSessionDate(event.target.value)
          }
          required
        />

        <input
          type="number"
          value={newSessionDuration}
          onChange={(event) =>
            setNewSessionDuration(event.target.value)
          }
          placeholder="Minutes"
          min="1"
          required
        />

        <button type="submit">Add Session</button>
      </form>

      <div className="subjects-list">
        {sessions.map((session) => (
          <div className="subject-item" key={session.id}>
            <h2>{session.title}</h2>
            <p>
  Date: {new Date(session.session_date).toLocaleDateString("en-GB")}
</p>
            <p>Duration: {session.duration_minutes} minutes</p>
            <button onClick={() => handleDeleteSession(session.id)}>
  Delete
</button>
          </div>
        ))}
      </div>

      <button onClick={() => setPage("dashboard")}>
        Back
      </button>
    </main>
  );
}
if (isLoggedIn) {
  return (
    <main className="dashboard">
      <h1>Study Planner</h1>
     <p>Welcome back! Choose what you want to manage.</p>

<section className="dashboard-grid">
  <article className="dashboard-card" onClick={() => setPage("subjects")}>
    <span>📚</span>
    <h2>Subjects</h2>
    <p>Manage your study subjects.</p>
    <strong>{subjects.length} Subjects</strong>
  </article>

  <article
  className="dashboard-card"
  onClick={() => setPage("tasks")}
>
    <span>✅</span>
    <h2>Tasks</h2>
    <p>Create and track your tasks.</p>
    <strong>{tasks.length} Tasks</strong>
  </article>

  <article
  className="dashboard-card"
  onClick={() => setPage("sessions")}
>
    <span>⏱️</span>
    <h2>Study Sessions</h2>
    <p>Plan your study sessions.</p>
    <strong>{sessions.length} Sessions</strong>
  </article>
</section>
<section className="stats-chart">
  <h2>Study Overview</h2>

  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar
        dataKey="total"
        fill="#2563eb"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</section>
<button className="logout-button" onClick={handleLogout}>
  Logout
</button>
    </main>
  );
}
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Study Planner</h1>
        <p>Organize your subjects, tasks and study sessions.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}

export default App;