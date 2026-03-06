import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { generateTaskFromAI } from './aiService';
import { toast } from 'sonner';
import { Loader2, Sparkles, Calendar, Trash2, Edit2, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCard = ({ task, onDragStart, onDelete, onEdit }) => {
    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return '#f87171';
            case 'medium': return '#fbbf24';
            case 'low': return '#34d399';
            default: return '#94a3b8';
        }
    };

    return (
        <motion.div
            layout
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="task-card-glass"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            whileHover={{
                scale: 1.03,
                rotate: 1,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                borderColor: "rgba(255, 239, 94, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <div
                className="priority-indicator"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
            />
            <div className="task-content">
                <div className="task-header-row">
                    <span className="task-title-text">{task.title}</span>
                    <div className={`priority-badge ${task.priority}`}>{task.priority}</div>
                </div>

                {task.description && (
                    <p className="task-desc">
                        {task.description}
                    </p>
                )}

                <div className="task-footer">
                    <div className="task-date-badge">
                        <Clock size={12} />
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Date'}
                    </div>
                    <div className="task-actions">
                        <motion.button whileHover={{ scale: 1.2, color: '#FFEF5E' }} onClick={() => onEdit(task)}>
                            <Edit2 size={14} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={() => onDelete(task.id)}>
                            <Trash2 size={14} />
                        </motion.button>
                    </div>
                </div>
            </div>
            {/* Shimmer Effect */}
            <motion.div
                className="card-shimmer"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                    skewX: -20,
                    pointerEvents: "none"
                }}
            />
        </motion.div>
    );
};

const KanbanColumn = ({ title, status, tasks, onDrop, onDragOver, onDragStart, onDelete, onEdit, i }) => {
    return (
        <motion.div
            className="kanban-column"
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <motion.div
                className="column-header-glass"
                whileHover={{ y: -2, borderColor: 'rgba(255, 239, 94, 0.3)' }}
            >
                <div className="column-title-wrap">
                    <span className={`status-dot ${status}`}></span>
                    <h3>{title}</h3>
                </div>
                <span className="count-badge">{tasks.length}</span>
            </motion.div>

            <motion.div className="task-list-ref" layout>
                <AnimatePresence mode='popLayout'>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={onDragStart}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                    <motion.div
                        className="empty-column-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                    >
                        Drop items here
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default function DashboardView({ user }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiInput, setAiInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (user) fetchTasks(user.id);
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            setLoading(true);
            const query = supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        try {
            setIsGenerating(true);
            const taskData = await generateTaskFromAI(aiInput);

            const newTask = {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                due_date: taskData.due_date,
                status: 'todo',
                user_id: user.id
            };

            const { data, error } = await supabase
                .from('tasks')
                .insert([newTask])
                .select()
                .single();

            if (error) throw error;

            setTasks([data, ...tasks]);
            setAiInput("");
            toast.success('Task created successfully!');
        } catch (error) {
            toast.error('AI generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = async (e, status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== status) {
            const updatedTasks = tasks.map(t =>
                t.id === taskId ? { ...t, status } : t
            );
            setTasks(updatedTasks);
            try {
                await supabase.from('tasks').update({ status }).eq('id', taskId);
            } catch {
                fetchTasks(user.id);
            }
        }
    };

    const handleDelete = async (taskId) => {
        // Optimistic delete
        setTasks(tasks.filter(t => t.id !== taskId));
        await supabase.from('tasks').delete().eq('id', taskId);
        toast('Task moved to trash');
    };

    const handleEdit = (task) => {
        const newTitle = prompt("Edit Task Title", task.title);
        if (newTitle) {
            supabase.from('tasks').update({ title: newTitle }).eq('id', task.id).then(() => {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, title: newTitle } : t));
            });
        }
    };

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'done');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    return (
        <div className="dashboard-content">
            <motion.div
                className="dashboard-hero"
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="hero-text">
                    <motion.h2
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Welcome back, <motion.span
                            className="highlight-text"
                            animate={{
                                color: ["#FFEF5E", "#fff", "#FFEF5E"],
                                textShadow: ["0 0 10px rgba(255,239,94,0.5)", "0 0 20px rgba(255,255,255,0.5)", "0 0 10px rgba(255,239,94,0.5)"]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >Creator</motion.span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >What are we building today?</motion.p>
                </div>
                <motion.form
                    onSubmit={handleAiSubmit}
                    className="ai-input-modern"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileFocusWithin={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 239, 94, 0.15)" }}
                >
                    <Sparkles className="ai-icon" size={20} />
                    <input
                        type="text"
                        className="ai-input-field"
                        placeholder="Ask AI to plan your day..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        disabled={isGenerating}
                    />
                    <motion.button
                        type="submit"
                        disabled={isGenerating}
                        className="ai-btn"
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isGenerating ? <Loader2 className="spin" /> : <ArrowRightIcon />}
                    </motion.button>
                </motion.form>
            </motion.div>

            {loading ? (
                <div className="loading-container">
                    <Loader2 className="spin" size={40} color="#FFEF5E" />
                </div>
            ) : (
                <motion.div
                    className="kanban-board-modern"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <KanbanColumn
                        title="To Do"
                        status="todo"
                        tasks={todoTasks}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragStart={handleDragStart}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        i={0}
                    />
                    <KanbanColumn
                        title="In Progress"
                        status="in-progress"
                        tasks={inProgressTasks}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragStart={handleDragStart}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        i={1}
                    />
                    <KanbanColumn
                        title="Completed"
                        status="completed"
                        tasks={completedTasks}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragStart={handleDragStart}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        i={2}
                    />
                </motion.div>
            )}
        </div>
    );
}

const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);
