-- SUWA SAHANA MADICAL CLINIC - Schema migration
-- Run this in Supabase SQL Editor if data save fails for bills, tests, or reports.
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS.

-- Bills: lifetime discount flag
ALTER TABLE bills ADD COLUMN IF NOT EXISTS lifetime_discount BOOLEAN DEFAULT false;

-- Bill items: report workflow status
ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS report_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Tests: report footer fields
ALTER TABLE tests ADD COLUMN IF NOT EXISTS footer_text TEXT;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS footer_image_url TEXT;

-- Test subcategories: UOM and less/more markers
ALTER TABLE test_subcategories ADD COLUMN IF NOT EXISTS uom VARCHAR(50);
ALTER TABLE test_subcategories ADD COLUMN IF NOT EXISTS less_more TEXT
  CHECK (less_more IS NULL OR less_more IN ('less', 'more'));
ALTER TABLE test_subcategories ADD COLUMN IF NOT EXISTS less_more_comment TEXT;
ALTER TABLE test_subcategories ADD COLUMN IF NOT EXISTS less_more_mark NUMERIC;

-- Test results: scope results per bill line item
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS bill_item_id UUID REFERENCES bill_items(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_test_results_bill_item_id ON test_results(bill_item_id);

-- Reference ranges: allow text values (e.g. "<140")
ALTER TABLE reference_ranges ALTER COLUMN min_value TYPE TEXT USING min_value::TEXT;
ALTER TABLE reference_ranges ALTER COLUMN max_value TYPE TEXT USING max_value::TEXT;
