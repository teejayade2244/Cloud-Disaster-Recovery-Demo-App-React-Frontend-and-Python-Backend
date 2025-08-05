import { motion } from "framer-motion"
import { LogOut, LayoutDashboard, Settings, Bell, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Dashboard({ onLogout }) {
    const navigate = useNavigate()

    // This is a placeholder for fetching user-specific data.
    // You would replace this with an actual API call to your backend.
    const userSpecificData = {
        notes: [
            "Welcome to your dashboard!",
        ],
    }

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
                <LayoutDashboard size={80} className="mx-auto" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Welcome to Your Dashboard!
            </h2>
            <p className="text-gray-400 mb-6">
                You have successfully logged in. This is your personal space.
            </p>

            {/* Display user-specific data */}
            <div className="text-left bg-gray-700 p-4 rounded-xl mb-6 shadow-inner">
                <h3 className="text-xl font-bold text-white mb-2">
                    Your Notes
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {userSpecificData.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                    ))}
                </ul>
            </div>

            <div className="space-y-4">
                <motion.button
                    onClick={() => navigate("/profile")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                    <User size={20} />
                    <span>Go to Profile</span>
                </motion.button>
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
