import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tasks', icon: CheckSquare, label: 'All Tasks' },
        { id: 'ai-chat', icon: Sparkles, label: 'AI Planner' },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        }
    };

    return (
        <motion.div
            className="sidebar"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="sidebar-logo" variants={itemVariants}>
                <motion.span
                    className="logo-spark"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    ⚡
                </motion.span>
                TaskFlow
            </motion.div>

            <div className="sidebar-menu">
                {menuItems.map(item => (
                    <motion.button
                        key={item.id}
                        variants={itemVariants}
                        className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.05, x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div
                                className="active-indicator"
                                layoutId="active-indicator"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            <motion.div className="sidebar-footer" variants={itemVariants}>
                <a href="/" className="menu-item" style={{ textDecoration: 'none' }}>
                    <ArrowLeft size={20} />
                    <span>Back to Portfolio</span>
                </a>
                <motion.button
                    className="menu-item logout"
                    onClick={handleLogout}
                    whileHover={{ color: '#ef4444' }}
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;
