
-- Add the column to store the assigned vendor's ID
ALTER TABLE public.timeline_items
ADD COLUMN assigned_vendor_id UUID;

-- Add a foreign key constraint to link it to the vendors table
ALTER TABLE public.timeline_items
ADD CONSTRAINT timeline_items_assigned_vendor_id_fkey
FOREIGN KEY (assigned_vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;
