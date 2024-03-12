import { useState, useEffect, useRef } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

import BASE_URL from "./../server/api/apiConfig";

const TaskForm = () => {
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        titleRef.current &&
        !titleRef.current.contains(event.target) &&
        !descriptionRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsTitleFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a task");
      return;
    }

    setLoading(true);

    const task = { title, description: JSON.stringify(description), completed };

    const response = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

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
      setIsTitleFocused(false);
      dispatch({ type: "ADD_TASK", payload: data });
    }
  };

  const handleTitleFocus = () => {
    setIsTitleFocused(true);
  };

  const handleDescriptionFocus = () => {
    setIsTitleFocused(true);
  };

  const handleError = () => {
    const time = setTimeout(() => {
      setError(null);
    }, 3000);
    return () => clearTimeout(time);
  };

  const resizeTextArea = () => {
    const textarea = document.getElementById("description");
    textarea.style.height = "";
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
  };

  return (
    <form
      className={`create ${isTitleFocused ? "title-focused" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={titleRef}
        type="text"
        id="title"
        value={title}
        placeholder="Add task here.."
        onChange={(e) => setTitle(e.target.value)}
        onFocus={handleTitleFocus}
      />
      <textarea
        ref={descriptionRef}
        id="description"
        rows="2"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
        onFocus={handleDescriptionFocus}
        onInput={resizeTextArea}
      />
      <button ref={buttonRef} disabled={loading} className="button">
        {loading ? "Creating Task..." : "Create Task"}
      </button>
      {error && (
        <p className="error" onClick={handleError}>
          {error}
        </p>
      )}
    </form>
  );
};

export default TaskForm;
