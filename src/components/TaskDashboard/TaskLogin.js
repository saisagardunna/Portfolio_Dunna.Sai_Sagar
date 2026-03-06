import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import '../../styles/task-dashboard.css';

const TaskLogin = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setSent(true);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background-animation">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="floating-particle"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="login-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                <div className="login-header">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <a href="/" className="back-link">← Back to Portfolio</a>
                        <h1>TaskFlow</h1>
                        <p>AI-Powered Productivity</p>
                    </motion.div>
                </div>

                {sent ? (
                    <motion.div
                        className="login-success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <CheckCircle size={48} color="#10b981" />
                        <h3>Check your inbox</h3>
                        <p>We sent a magic link to <strong>{email}</strong></p>
                        <button onClick={() => setSent(false)} className="btn-secondary">
                            Try another email
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary-glow">
                            {loading ? <Loader2 className="spin" /> : <>Sign In with Email <ArrowRight size={18} /></>}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default TaskLogin;
