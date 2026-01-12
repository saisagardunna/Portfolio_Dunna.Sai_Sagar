
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import '../styles/chat.css';

const PRESETS = ['Neon', 'Cyber', 'Solar', 'Lunar', 'Astro', 'Quantum', 'Glitch', 'Flux', 'Echo', 'Vortex'];
const ANIMALS = ['Fox', 'Tiger', 'Wolf', 'Hawk', 'Viper', 'Bear', 'Owl', 'Shark', 'Raven', 'Cobra'];

const getRandomName = () => {
    const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `${p} ${a}`;
};

const ChatBoard = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username] = useState(getRandomName());
    const [onlineCount, setOnlineCount] = useState(1);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Fetch absolute initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(50);

            if (error) {
                console.error("Fetch Error:", error);
            } else if (data) {
                setMessages(data);
                scrollToBottom();
            }
        };

        fetchMessages();

        // Subscribe to messages
        const messageSubscription = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
                scrollToBottom();
            })
            .subscribe();

        // Presence (Online Users)
        const presenceChannel = supabase.channel('room1');

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const count = Object.keys(state).length;
                setOnlineCount(count);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ user: username });
                }
            });

        return () => {
            supabase.removeChannel(messageSubscription);
            supabase.removeChannel(presenceChannel);
        };
    }, [username]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert([
                { content: newMessage, username: username }
            ]);

        if (error) {
            console.error('Error sending message:', error);
            console.error('Error sending message:', error);
            alert(`Error: ${error.message}\n(Check Supabase RLS Policies)`);
        } else {
            setNewMessage('');
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <h1 className="chat-title">Real-Time Community</h1>
                    <div className="online-badge">
                        <span className="dot"></span>
                        {onlineCount} Members Online
                    </div>
                </div>

                <div className="messages-area">
                    {messages.length === 0 && (
                        <div className="empty-state">
                            <p>No messages yet. Be the first to say hello!</p>
                            <small>(Ensure 'messages' table exists in Supabase)</small>
                        </div>
                    )}
                    {messages.map((msg, index) => {
                        const isMe = msg.username === username;
                        return (
                            <div key={index} className={`message-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                                <div className="message-bubble">
                                    <div className="message-user">{msg.username}</div>
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder={`Type a message as ${username}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="chat-input"
                    />
                    <button type="submit" className="send-btn">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBoard;
