import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    Routes,
    Route,
    useNavigate,
    Navigate,
    useLocation,
} from "react-router-dom"
import { LogIn, UserPlus, LogOut, Settings, User } from "lucide-react"

// --- Import all the separate page components ---
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"

// --- Main App component that holds the application state and layout ---
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // useEffect to check for a token in local storage on initial load.
    // This enables persistent login.
    useEffect(() => {
        const userToken = localStorage.getItem("userToken")
        if (userToken) {
            setIsLoggedIn(true)
            // Optional: You could also fetch user data here to re-hydrate the state.
        }
    }, [])

    // Function to handle a successful login, saving the token
    const handleLoginSuccess = (token) => {
        localStorage.setItem("userToken", token)
        setIsLoggedIn(true)
        toast.success("Login successful!")
    }

    // Function to handle logout, removing the token from local storage
    const handleLogout = () => {
        localStorage.removeItem("userToken")
        setIsLoggedIn(false)
        toast.info("You have been logged out.")
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 font-inter antialiased">
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <AnimatePresence mode="wait">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={isLoggedIn ? "/dashboard" : "/login"}
                                replace
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} />
                            )
                        }
                    />
                    <Route path="/signup" element={<SignUp />} />
                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            isLoggedIn ? (
                                <Dashboard onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    {/* CORRECTED LINE: Render <Profile /> when logged in and on /profile route */}
                    <Route
                        path="/profile"
                        element={
                            isLoggedIn ? (
                                <Profile onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </AnimatePresence>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )
}

// --- Header component for global navigation ---
const Header = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex items-center justify-between z-10"
        >
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-400"
                >
                    <path d="M12 2L2 12l10 10 10-10L12 2z" />
                    <path d="M12 2v20" />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    AuraFlow
                </h1>
            </div>
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center space-x-2 sm:space-x-4"
            >
                {isLoggedIn ? (
                    <>
                        <motion.button
                            onClick={() => navigate("/profile")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full font-semibold transition-colors duration-300 ${
                                location.pathname === "/profile"
                                    ? "bg-pink-600 text-white shadow-lg"
                                    : "bg-transparent text-pink-400 border border-pink-400"
                            }`}
                        >
                            <User size={20} className="inline mr-2" />
                            Profile
                        </motion.button>
                        <motion.button
                            onClick={onLogout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="py-2 px-4 sm:py-3 sm:px-6 rounded-full font-semibold transition-colors duration-300 bg-red-600 text-white shadow-lg"
                        >
                            <LogOut size={20} className="inline mr-2" />
                            Logout
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.button
                            onClick={() => navigate("/login")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full font-semibold transition-colors duration-300 ${
                                location.pathname === "/login"
                                    ? "bg-pink-600 text-white shadow-lg"
                                    : "bg-transparent text-pink-400 border border-pink-400"
                            }`}
                        >
                            <LogIn size={20} className="inline mr-2" />
                            Login
                        </motion.button>
                        <motion.button
                            onClick={() => navigate("/signup")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full font-semibold transition-colors duration-300 ${
                                location.pathname === "/signup"
                                    ? "bg-pink-600 text-white shadow-lg"
                                    : "bg-transparent text-pink-400 border border-pink-400"
                            }`}
                        >
                            <UserPlus size={20} className="inline mr-2" />
                            Sign Up
                        </motion.button>
                    </>
                )}
            </motion.nav>
        </motion.header>
    )
}
