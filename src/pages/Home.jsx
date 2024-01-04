import { useState, useEffect } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";

import TaskDetails from "../components/TaskDetails";
import TaskForm from "../components/TaskForm";

const Home = () => {
  const { user } = useAuthContext();
  const { tasks, dispatch } = useTaskContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      if (!user) return;

      setLoading(true);

      const response = await fetch(
        "https://tasks-backend-one.vercel.app/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

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
      <TaskForm />
      <div className="tasks">
        {loading && <p className="empty">Loading...</p>}
        {!loading && tasks.length === 0 && (
          <p className="empty">No tasks yet!</p>
        )}
        {!loading &&
          tasks.map((task) => <TaskDetails key={task._id} task={task} />)}
      </div>
    </div>
  );
};

export default Home;
