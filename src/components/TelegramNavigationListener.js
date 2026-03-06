import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://drllledoxzmbnbldprat.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybGxsZWRveHptYm5ibGRwcmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODUxNjAsImV4cCI6MjA1MjM2MTE2MH0.Rw8YqL0PGnkD9F_2r8vCvjF8Ls7JIoP6P8_K3VmPVEA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * TelegramNavigationListener
 * Subscribes to navigation_commands table and:
 * - Navigates to a route when command = page name
 * - Opens a URL in new tab when command = 'open_project'
 */
const TelegramNavigationListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🤖 Telegram Navigation Listener initialized');

        const channel = supabase
            .channel('navigation-commands')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'navigation_commands' },
                (payload) => {
                    console.log('📱 Telegram command received:', payload.new);

                    const command    = payload.new.command;
                    const projectUrl = payload.new.project_url;

                    // Open a project in a new tab
                    if (command === 'open_project' && projectUrl) {
                        console.log(`🚀 Opening project: ${projectUrl}`);
                        window.open(projectUrl, '_blank');
                        showToastBanner('🚀 Opening project from Telegram!');
                        return;
                    }

                    // Page navigation
                    const routeMap = {
                        'home':        '/',
                        'projects':    '/projects',
                        'contact':     '/contact',
                        'resume':      '/resume',
                        'gallery':     '/gallery',
                        'certificate': '/gallery',
                        'about':       '/about',
                        'chat':        '/chat',
                        'tasks':       '/tasks',
                    };

                    const route = routeMap[command.toLowerCase()];

                    if (route) {
                        console.log(`🧭 Navigating to: ${route}`);
                        navigate(route);
                        showToastBanner(`📱 Navigated to ${command} via Telegram`);
                    } else {
                        console.warn(`⚠️ Unknown command: ${command}`);
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Telegram Listener status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Ready — Telegram can now control this browser!');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Realtime failed — check Supabase realtime & fix-navigation-table.sql');
                }
            });

        return () => {
            console.log('🔌 Unsubscribing Telegram Navigation Listener');
            supabase.removeChannel(channel);
        };
    }, [navigate]);

    return null;
};

// Floating toast banner shown when Telegram triggers an action
function showToastBanner(message) {
    const el = document.createElement('div');
    el.innerText = message;
    Object.assign(el.style, {
        position:   'fixed',
        top:        '20px',
        left:       '50%',
        transform:  'translateX(-50%)',
        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        color:      '#fff',
        padding:    '12px 28px',
        borderRadius: '30px',
        fontFamily: 'Inter, sans-serif',
        fontSize:   '14px',
        fontWeight: '600',
        boxShadow:  '0 8px 32px rgba(6,182,212,0.5)',
        zIndex:     '99999',
        transition: 'opacity 0.5s',
        opacity:    '1',
        whiteSpace: 'nowrap',
    });
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; }, 2500);
    setTimeout(() => { el.remove(); }, 3100);
}

export default TelegramNavigationListener;
