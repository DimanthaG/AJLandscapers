-- Add status column to quote_requests
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

-- Add status column to contact_submissions
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

-- Update existing rows to have 'active' status
UPDATE quote_requests SET status = 'active' WHERE status IS NULL;
UPDATE contact_submissions SET status = 'active' WHERE status IS NULL; 