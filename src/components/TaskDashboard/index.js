import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import TaskLogin from './TaskLogin';
import DashboardView from './TaskDashboard';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';
import '../../styles/task-dashboard.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskIndex() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
            <div className="loader-pulse" />
        </div>
    );

    return (
        <div className="task-app-root">
            <Toaster position="top-right" theme="dark" />

            <AnimatePresence mode='wait'>
                {!user ? (
                    <TaskLogin key="login" />
                ) : (
                    <div className="dashboard-layout" key="dashboard">
                        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                        <motion.main
                            className="main-staging-area"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnimatePresence mode="wait">
                                {activeTab === 'dashboard' && (
                                    <motion.div
                                        key="dashboard"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <DashboardView user={user} />
                                    </motion.div>
                                )}
                                {activeTab === 'tasks' && (
                                    <motion.div
                                        key="tasks"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <DashboardView user={user} />
                                    </motion.div>
                                )}
                                {activeTab === 'ai-chat' && (
                                    <motion.div
                                        key="ai-chat"
                                        className="placeholder-view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h2>AI Planner Context</h2>
                                        <p>Coming soon: Chat with your tasks.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.main>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
