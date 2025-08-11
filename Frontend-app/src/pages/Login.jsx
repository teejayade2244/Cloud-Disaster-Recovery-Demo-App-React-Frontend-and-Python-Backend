import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const API_URL =
            "http://internal-k8s-auraflow-fastapib-52bb77b38e-17643138.eu-west-2.elb.amazonaws.com/api/v1/users/login"
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                onLoginSuccess()
                // The App component will handle the navigation to the dashboard
            } else {
                toast.error(
                    data.detail ||
                        "Login failed. Please check your credentials."
                )
                console.error("Login failed:", data)
            }
        } catch (error) {
            console.error("Error during login:", error)
            toast.error(
                "Failed to connect to the server. Please try again later."
            )
        } finally {
            setLoading(false)
        }
    }

    const inputClasses =
        "w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
    const labelClasses = "block text-sm font-medium mb-1 text-gray-400"

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 200 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -200 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-gray-800 backdrop-blur-lg bg-opacity-70 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto relative z-10"
        >
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6"
            >
                Welcome Back
            </motion.h2>

            <motion.form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <label htmlFor="email-login" className={labelClasses}>
                        Email Address
                    </label>
                    <div className="relative flex items-center">
                        <Mail
                            className="absolute left-3 text-gray-500"
                            size={20}
                        />
                        <input
                            id="email-login"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${inputClasses} pl-10`}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <label htmlFor="password-login" className={labelClasses}>
                        Password
                    </label>
                    <div className="relative flex items-center">
                        <Lock
                            className="absolute left-3 text-gray-500"
                            size={20}
                        />
                        <input
                            id="password-login"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${inputClasses} pl-10`}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>
                </motion.div>

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg"
                    disabled={loading}
                >
                    <div className="flex items-center justify-center space-x-2">
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
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
                        ) : (
                            <LogIn size={20} />
                        )}
                        <span>{loading ? "Logging in..." : "Login"}</span>
                    </div>
                </motion.button>

                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-pink-400 font-medium hover:text-pink-300 transition-colors duration-200"
                    >
                        Sign up
                    </button>
                </div>
            </motion.form>
        </motion.div>
    )
}
