import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://drllledoxzmbnbldprat.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybGxsZWRveHptYm5ibGRwcmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODUxNjAsImV4cCI6MjA1MjM2MTE2MH0.Rw8YqL0PGnkD9F_2r8vCvjF8Ls7JIoP6P8_K3VmPVEA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * TelegramNavigationListener - Listen for navigation commands from Telegram bot
 * This component subscribes to the navigation_commands table and navigates accordingly
 */
const TelegramNavigationListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🤖 Telegram Navigation Listener initialized');

        // Subscribe to realtime changes in navigation_commands table
        const channel = supabase
            .channel('navigation-commands')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'navigation_commands'
                },
                (payload) => {
                    console.log('📱 Received navigation command:', payload);

                    const command = payload.new.command;
                    const projectUrl = payload.new.project_url;

                    // Handle special command: open_project
                    if (command === 'open_project' && projectUrl) {
                        console.log(`🚀 Opening project: ${projectUrl}`);
                        window.open(projectUrl, '_blank');
                        return;
                    }

                    // Map commands to routes
                    const routeMap = {
                        'home': '/',
                        'projects': '/projects',
                        'contact': '/contact',
                        'resume': '/resume',
                        'gallery': '/gallery',
                        'certificate': '/gallery',
                        'about': '/about',
                        'chat': '/chat'
                    };

                    const route = routeMap[command.toLowerCase()];

                    if (route) {
                        console.log(`🧭 Navigating to: ${route}`);
                        navigate(route);

                        // Optional: Show a toast notification
                        if (typeof window !== 'undefined' && window.showToast) {
                            window.showToast(`Navigated to ${command} via Telegram`);
                        }
                    } else {
                        console.warn(`⚠️ Unknown navigation command: ${command}`);
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status);
            });

        // Cleanup on unmount
        return () => {
            console.log('🔌 Unsubscribing from navigation commands');
            supabase.removeChannel(channel);
        };
    }, [navigate]);

    // This component doesn't render anything
    return null;
};

export default TelegramNavigationListener;
