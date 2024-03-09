/* eslint-disable react/prop-types */
import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

import { useEffect, useState } from "react";

import formatDistanceToNow from "date-fns/formatDistanceToNow";

// eslint-disable-next-line react/prop-types
const TaskDetails = ({ task }) => {
  const parsedDescription = JSON.parse(task.description);

  const descriptionLines = parsedDescription.split("\n");

  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [timeAgo, setTimeAgo] = useState(
    formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(
        formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [task.createdAt, task.selectedDate]);

  const handleDelete = async (id) => {
    if (!user) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        dispatch({ type: "DELETE_TASK", payload: data });
      } else {
        setLoading(false);
        console.error("Failed to delete task on the server:", data.error);
      }
    } catch (error) {
      setLoading(false);
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleComplete = async (id) => {
    if (!user) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    dispatch({ type: "COMPLETE_TASK", payload: updatedTask });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: "COMPLETE_TASK", payload: task });
        console.error("Failed to update task on the server:", data.error);
      }
    } catch (error) {
      dispatch({ type: "COMPLETE_TASK", payload: task });
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="task-details">
      <h2 className={task.completed ? "done" : ""}>{task.title}</h2>
      <span>{timeAgo}</span>
      <div className="description">
        {descriptionLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="align">
        <button
          className={`completebutton ${task.completed ? "" : "deletebutton"}`}
          onClick={() => handleComplete(task._id)}
        >
          {task.completed ? "Completed" : " Not Complete Yet"}
        </button>

        {user && (
          <button
            disabled={loading}
            className="deletebutton"
            onClick={() => handleDelete(task._id)}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
