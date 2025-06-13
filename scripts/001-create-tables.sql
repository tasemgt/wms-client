-- Create database tables for wedding management system

-- Users table (Admins and Bouncers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'bouncer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gift items catalog
CREATE TABLE IF NOT EXISTS gift_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    times_selected INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    guest_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    attending_status VARCHAR(10) NOT NULL CHECK (attending_status IN ('yes', 'maybe', 'no')),
    guest_type VARCHAR(10) NOT NULL CHECK (guest_type IN ('single', 'group')),
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    gift_preference VARCHAR(10) CHECK (gift_preference IN ('yes', 'no')),
    gift_type VARCHAR(10) CHECK (gift_type IN ('gift', 'money')),
    money_contribution DECIMAL(10,2) DEFAULT 0,
    goodwill_message TEXT,
    qr_code_sent BOOLEAN DEFAULT FALSE,
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group members (for group registrations)
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    guest_id VARCHAR(20) REFERENCES guests(guest_id),
    member_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest gift selections
CREATE TABLE IF NOT EXISTS guest_gift_selections (
    id SERIAL PRIMARY KEY,
    guest_id VARCHAR(20) REFERENCES guests(guest_id),
    gift_item_id INTEGER REFERENCES gift_items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@wedding.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXu', 'Wedding Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample gift items
INSERT INTO gift_items (name, description) VALUES 
('Toaster', 'Kitchen appliance for toasting bread'),
('Blender', 'Kitchen blender for smoothies and cooking'),
('Dinner Set', 'Complete dinner set for 6 people'),
('Bed Sheets', 'Premium cotton bed sheet set'),
('Coffee Maker', 'Automatic coffee brewing machine'),
('Microwave', 'Kitchen microwave oven'),
('Iron', 'Steam iron for clothes'),
('Vacuum Cleaner', 'Home vacuum cleaning system')
ON CONFLICT DO NOTHING;
