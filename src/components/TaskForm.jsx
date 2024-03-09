import { useState } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

const TaskForm = () => {
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a task");
      return;
    }

    setLoading(true);

    const task = { title, description: JSON.stringify(description), completed };

    const response = await fetch(
      "https://tasks-backend-one.vercel.app/api/tasks",
      {
        method: "POST",
        body: JSON.stringify(task),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      setLoading(false);
    }

    if (response.ok) {
      setTitle("");
      setDescription("");
      setCompleted(false);
      setError(null);
      setLoading(false);
      dispatch({ type: "ADD_TASK", payload: data });
    }
  };

  const handleError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h2>Create New Task</h2>
      {error && (
        <p className="error" onClick={() => handleError}>
          {error}
        </p>
      )}
      <input
        type="text"
        id="title"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        id="description"
        rows="3"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button disabled={loading} className="button">
        {loading ? "Creating Task..." : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
