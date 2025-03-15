-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Add some test data
INSERT INTO quote_requests (name, email, phone, service, message)
VALUES 
  ('Test User', 'test@example.com', '123-456-7890', 'Landscaping', 'Test quote request'),
  ('John Doe', 'john@example.com', '987-654-3210', 'Lawn Care', 'Another test request');

INSERT INTO contact_submissions (name, email, message)
VALUES 
  ('Test Contact', 'contact@example.com', 'Test contact message'),
  ('Jane Smith', 'jane@example.com', 'Another test message'); 