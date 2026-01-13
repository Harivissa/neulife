-- Remove the dangerous public access policy from medical_history
DROP POLICY IF EXISTS "Public can view medical history by hcid" ON public.medical_history;

-- Remove the dangerous public access policy from medical_qr_tokens
DROP POLICY IF EXISTS "Public can verify QR tokens" ON public.medical_qr_tokens;