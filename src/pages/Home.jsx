import { useState, useEffect } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";

import TaskDetails from "../components/TaskDetails";
import TaskForm from "../components/TaskForm";

import BASE_URL from "./../server/api/apiConfig";

import { Reorder } from "framer-motion";

const Home = () => {
  const { user } = useAuthContext();
  const { tasks, dispatch } = useTaskContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      if (!user) return;

      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        dispatch({ type: "SET_TASKS", payload: data });
      }
    };

    if (user) {
      setLoading(true);
      getTasks();
    }
  }, [user, dispatch]);

  return (
    <div className="home pages">
      <div className="task-form">
        <TaskForm />
      </div>
      <Reorder.Group
        values={tasks}
        onReorder={(newTasks) => {
          dispatch({ type: "SET_TASKS", payload: newTasks });
        }}
      >
        <div className="tasks">
          {loading && <p className="empty">Loading...</p>}
          {!loading && tasks && tasks.length === 0 && (
            <p className="empty">No tasks yet!</p>
          )}
          {!loading &&
            tasks &&
            tasks.map((task) => <TaskDetails key={task._id} task={task} />)}
        </div>
      </Reorder.Group>
    </div>
  );
};

export default Home;
