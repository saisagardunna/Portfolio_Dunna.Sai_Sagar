-- Create projects table in Supabase
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    tech TEXT[] NOT NULL,
    category TEXT NOT NULL,
    link TEXT,
    link_text TEXT,
    keywords TEXT[],
    description TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT
    USING (is_active = true);

-- Create policy to allow all operations for authenticated users (you)
CREATE POLICY "Allow full access for authenticated users" ON projects
    FOR ALL
    USING (true);

-- Insert existing projects
INSERT INTO projects (title, tech, category, link, keywords, description) VALUES
('Startup Business Platform – Revenue Generating', 
 ARRAY['React', 'TypeScript'], 
 'Web Dev', 
 'https://moores.vercel.app',
 ARRAY['moores', 'startup', 'start up', 'business platform'],
 ARRAY[
     'Developed production platform serving 10+ customers with 100+ orders delivered, generating consistent revenue',
     'Engineered comprehensive business rules and order workflows reducing processing time by 40%',
     'Architected scalable React codebase with TypeScript achieving 99% uptime across 500+ user sessions'
 ]),

('AI Mock Interview Platform',
 ARRAY['FastAPI', 'React', 'TypeScript'],
 'AI/ML',
 'https://ai-mock-interview-iota-wine.vercel.app',
 ARRAY['mock interview', 'interview platform'],
 ARRAY[
     'Created full-stack AI interview platform supporting voice and text interactions with 10+ active users',
     'Integrated conversational AI logic generating 50+ adaptive follow-up questions per interview session',
     'Developed FastAPI backend handling 200+ API requests daily with 250ms average response time'
 ]),

('AI Resume-Based Interview Bot',
 ARRAY['Python', 'Streamlit', 'NLP'],
 'AI/ML',
 'https://interviewbot-e9fzdrte4s86agcbdfv2uz.streamlit.app',
 ARRAY['resume bot', 'interview bot', 'resume based'],
 ARRAY[
     'Designed AI interview bot extracting 15+ key data points from resumes with 90% accuracy using NLP techniques',
     'Generated 30+ role-relevant technical and behavioral questions through advanced prompt engineering'
 ]),

('AI Travel Planning Application',
 ARRAY['React', 'Location APIs'],
 'Web Dev',
 'https://travel-eight-sooty.vercel.app',
 ARRAY['travel', 'travel planning', 'trip'],
 ARRAY[
     'Engineered location-aware app generating personalized itineraries for 10+ users using proximity algorithms',
     'Optimized visit routing reducing travel time by 30% through intelligent scheduling of 8+ daily attractions'
 ]),

('Skin Cancer Detection System',
 ARRAY['Python', 'CNN', 'FastAPI'],
 'AI/ML',
 'https://github.com/saisagardunna/cancer_detection',
 ARRAY['skin cancer', 'cancer detection', 'melanoma'],
 ARRAY[
     'Trained deep learning CNN model on 8000+ medical images achieving 92% classification accuracy',
     'Designed preprocessing pipelines processing images in under 2 seconds for real-time diagnosis',
     'Deployed FastAPI service with modular architecture handling 50+ daily inference requests'
 ]),

('Workflow Automation & Cloud Infrastructure',
 ARRAY['n8n', 'AWS', 'Docker', 'Terraform'],
 'Cloud/DevOps',
 NULL,
 ARRAY['workflow', 'automation', 'cloud', 'n8n'],
 ARRAY[
     'Automated workflows delivering 1000+ monthly messages across Twilio SMS, WhatsApp, and Telegram channels',
     'Streamlined Excel data updates reducing manual processing time by 75% through webhook integration',
     'Provisioned cloud infrastructure managing 5+ AWS EC2 instances and 10+ Docker containers using Terraform'
 ]),

('AI Recipe Generator',
 ARRAY['React', 'AI'],
 'AI/ML',
 'https://recipe-generator2.vercel.app',
 ARRAY['recipe', 'recipe generator', 'cooking'],
 ARRAY[
     'Launched AI-powered recipe application serving 10+ users with 1.5 second average response time',
     'Delivered structured cooking instructions with 95% user satisfaction through prompt-driven logic'
 ]),

('Seadra Assistant',
 ARRAY['React', 'AI Integration'],
 'Web Dev',
 'https://seadra-assistant.lovable.app/',
 ARRAY['seadra', 'cooking assistant', 'seafood'],
 ARRAY[
     'Developed an intelligent cooking assistant specialized in seafood recipes and preparation techniques',
     'Implemented interactive step-by-step instructions improving user cooking experience'
 ]),

('Fury Fighters',
 ARRAY['React', 'Gesture Recognition', '3D'],
 'AI/ML',
 'https://v0-gesture-controlled-fighting-game.vercel.app/',
 ARRAY['fury fighters', 'fighting game', 'gesture'],
 ARRAY[
     'Created an innovative browser-based fighting game controlled via webcam hand gestures',
     'Implemented real-time motion tracking to map physical punches and blocks to in-game actions'
 ]);
