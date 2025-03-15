-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check quote_requests data
SELECT COUNT(*) as quote_count 
FROM quote_requests;

-- Check contact_submissions data
SELECT COUNT(*) as contact_count 
FROM contact_submissions; 