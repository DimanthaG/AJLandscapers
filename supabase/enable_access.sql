-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON quote_requests
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON contact_submissions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Allow service role to bypass RLS
ALTER TABLE quote_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions FORCE ROW LEVEL SECURITY; 