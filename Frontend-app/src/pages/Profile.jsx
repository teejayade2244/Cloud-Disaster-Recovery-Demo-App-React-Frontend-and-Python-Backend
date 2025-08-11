import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    ListTodo,
    PlusCircle,
    CheckCircle,
    XCircle,
    Trash2,
    LogOut,
} from "lucide-react" // Added LogOut import
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function TodoList({ onLogout }) {
    const [todos, setTodos] = useState([])
    const [newTodoText, setNewTodoText] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Simulate fetching todos on component mount
    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true)
            const token = localStorage.getItem("userToken")

            if (!token) {
                onLogout()
                navigate("/login")
                return
            }

            try {
                // Placeholder for actual API call to fetch todos for the logged-in user
                // const response = await fetch("http://127.0.0.1:8000/api/v1/todos", {
                //   headers: { 'Authorization': `Bearer ${token}` }
                // });
                // const data = await response.json();
                // if (response.ok) {
                //   setTodos(data);
                // } else {
                //   toast.error("Failed to fetch todos.");
                //   onLogout();
                //   navigate("/login");
                // }

                // Mock data for demonstration
                const mockTodos = [
                    {
                        id: 1,
                        text: "Learn FastAPI for backend development",
                        completed: false,
                    },
                    {
                        id: 2,
                        text: "Integrate React frontend with FastAPI",
                        completed: true,
                    },
                    { id: 3, text: "Set up AWS RDS database", completed: true },
                    {
                        id: 4,
                        text: "Implement persistent login with tokens",
                        completed: false,
                    },
                ]
                setTodos(mockTodos)
            } catch (error) {
                console.error("Error fetching todos:", error)
                toast.error("Failed to fetch todos.")
            } finally {
                setLoading(false)
            }
        }

        fetchTodos()
    }, [onLogout, navigate])

    const handleAddTodo = async (e) => {
        e.preventDefault()
        if (newTodoText.trim() === "") {
            toast.warn("To-do item cannot be empty.")
            return
        }

        setLoading(true)
        const token = localStorage.getItem("userToken")

        try {
            // Placeholder for actual API call to add a todo
            // const response = await fetch("http://127.0.0.1:8000/api/v1/todos", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //     'Authorization': `Bearer ${token}`
            //   },
            //   body: JSON.stringify({ text: newTodoText })
            // });
            // const newTodo = await response.json();
            // if (response.ok) {
            //   setTodos([...todos, newTodo]);
            //   setNewTodoText("");
            //   toast.success("To-do added!");
            // } else {
            //   toast.error("Failed to add to-do.");
            // }

            // Mock addition
            const newId = Math.max(...todos.map((t) => t.id), 0) + 1
            const newTodo = { id: newId, text: newTodoText, completed: false }
            setTodos([...todos, newTodo])
            setNewTodoText("")
            toast.success("To-do added (mock)!")
        } catch (error) {
            console.error("Error adding todo:", error)
            toast.error("Failed to add to-do.")
        } finally {
            setLoading(false)
        }
    }

    const handleToggleTodo = async (id) => {
        setLoading(true)
        const token = localStorage.getItem("userToken")
        const todoToUpdate = todos.find((todo) => todo.id === id)

        try {
            // Placeholder for actual API call to update a todo
            // const response = await fetch(`http://127.0.0.1:8000/api/v1/todos/${id}`, {
            //   method: "PUT",
            //   headers: {
            //     "Content-Type": "application/json",
            //     'Authorization': `Bearer ${token}`
            //   },
            //   body: JSON.stringify({ completed: !todoToUpdate.completed })
            // });
            // if (response.ok) {
            //   setTodos(todos.map(todo =>

            //   ));
            //   toast.info("To-do status updated!");
            // } else {
            //   toast.error("Failed to update to-do status.");
            // }

            // Mock update
            setTodos(
                todos.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            )
            toast.info("To-do status updated (mock)!")
        } catch (error) {
            console.error("Error toggling todo:", error)
            toast.error("Failed to update to-do status.")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTodo = async (id) => {
        setLoading(true)
        const token = localStorage.getItem("userToken")

        try {
            // Placeholder for actual API call to delete a todo
            // const response = await fetch(`http://127.0.0.1:8000/api/v1/todos/${id}`, {
            //   method: "DELETE",
            //   headers: { 'Authorization': `Bearer ${token}` }
            // });
            // if (response.ok) {
            //   setTodos(todos.filter(todo => todo.id !== id));
            //   toast.success("To-do deleted!");
            // } else {
            //   toast.error("Failed to delete to-do.");
            // }

            // Mock deletion
            setTodos(todos.filter((todo) => todo.id !== id))
            toast.success("To-do deleted (mock)!")
        } catch (error) {
            console.error("Error deleting todo:", error)
            toast.error("Failed to delete to-do.")
        } finally {
            setLoading(false)
        }
    }

    const inputClasses =
        "w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-xl py-3 px-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
    const buttonClasses =
        "py-2 px-4 rounded-full font-semibold transition-colors duration-300 shadow-md"

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-gray-800 backdrop-blur-lg bg-opacity-70 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto relative z-10 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-pink-400 mb-6"
            >
                <ListTodo size={80} className="mx-auto" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Your To-Do List
            </h2>
            <p className="text-gray-400 mb-6">
                Keep track of your tasks and boost productivity.
            </p>

            <form onSubmit={handleAddTodo} className="flex space-x-2 mb-6">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new to-do..."
                    className={`${inputClasses} flex-grow`}
                    disabled={loading}
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${buttonClasses} bg-pink-600 hover:bg-pink-700 text-white`}
                    disabled={loading}
                >
                    <PlusCircle size={20} />
                </motion.button>
            </form>

            {loading && todos.length === 0 ? (
                <div className="flex justify-center items-center h-24">
                    <svg
                        className="animate-spin h-6 w-6 text-pink-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : todos.length === 0 ? (
                <p className="text-gray-400">
                    No to-do items yet. Add one above!
                </p>
            ) : (
                <ul className="space-y-3 text-left">
                    {todos.map((todo) => (
                        <motion.li
                            key={todo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center bg-gray-700 p-4 rounded-xl shadow-md"
                        >
                            <span
                                className={`flex-grow text-lg ${
                                    todo.completed
                                        ? "line-through text-gray-500"
                                        : "text-gray-200"
                                }`}
                            >
                                {todo.text}
                            </span>
                            <div className="flex space-x-2 ml-4">
                                <motion.button
                                    onClick={() => handleToggleTodo(todo.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 rounded-full ${
                                        todo.completed
                                            ? "text-green-400 hover:bg-green-900"
                                            : "text-gray-400 hover:bg-gray-600"
                                    }`}
                                    disabled={loading}
                                >
                                    {todo.completed ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <XCircle size={20} />
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-full text-red-400 hover:bg-red-900"
                                    disabled={loading}
                                >
                                    <Trash2 size={20} />
                                </motion.button>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </motion.button>
            </div>
        </motion.div>
    )
}
