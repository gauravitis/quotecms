-- Add GST percentage column to items table
ALTER TABLE items
ADD COLUMN gst_percentage numeric; 