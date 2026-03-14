import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface QRToken {
  id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}

const generateSecureToken = (length = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
};

export const useMedicalQR = () => {
  const { user } = useAuth();
  const [qrToken, setQrToken] = useState<QRToken | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateQRToken = useCallback(async (hcid: string) => {
    if (!user) return null;

    try {
      // Check for existing active token
      const { data: existingToken, error: fetchError } = await supabase
        .from('medical_qr_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('hcid', hcid)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching QR token:', fetchError);
        setError('Failed to check existing QR token');
        return null;
      }

      if (existingToken) {
        setQrToken(existingToken as QRToken);
        return existingToken.token;
      }

      // Create new token using cryptographically secure generation
      const newToken = generateSecureToken();
      const { data: createdToken, error: createError } = await supabase
        .from('medical_qr_tokens')
        .insert({
          user_id: user.id,
          hcid,
          token: newToken,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating QR token:', createError);
        setError('Failed to create QR token');
        return null;
      }

      setQrToken(createdToken as QRToken);
      return newToken;
    } catch (err) {
      console.error('Unexpected error in fetchOrCreateQRToken:', err);
      setError('Unable to generate QR. Please try again.');
      return null;
    }
  }, [user]);

  const generateQRCode = useCallback(async (hcid: string, baseUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await fetchOrCreateQRToken(hcid);
      if (!token) {
        setIsLoading(false);
        return null;
      }

      const url = `${baseUrl}/medical-summary/${token}`;
      setQrValue(url);
      setIsLoading(false);
      return url;
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Unable to generate QR. Please try again.');
      setIsLoading(false);
      return null;
    }
  }, [fetchOrCreateQRToken]);

  const disableQRToken = useCallback(async () => {
    if (!user || !qrToken) return false;

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('medical_qr_tokens')
        .update({ is_active: false })
        .eq('id', qrToken.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error disabling QR token:', updateError);
        setError('Failed to disable QR');
        setIsLoading(false);
        return false;
      }

      setQrToken(null);
      setQrValue(null);
      setError(null);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Unexpected error disabling QR:', err);
      setIsLoading(false);
      return false;
    }
  }, [user, qrToken]);

  const regenerateQRToken = useCallback(async (hcid: string, baseUrl: string) => {
    setIsLoading(true);
    setError(null);

    // Disable existing token if present
    if (qrToken) {
      const { error: updateError } = await supabase
        .from('medical_qr_tokens')
        .update({ is_active: false })
        .eq('id', qrToken.id)
        .eq('user_id', user?.id);

      if (updateError) {
        console.error('Error disabling old token:', updateError);
      }
      setQrToken(null);
      setQrValue(null);
    }

    // Generate new one
    const result = await generateQRCode(hcid, baseUrl);
    return result;
  }, [qrToken, user, generateQRCode]);

  return {
    qrValue,
    qrToken,
    isLoading,
    error,
    generateQRCode,
    disableQRToken,
    regenerateQRToken,
  };
};
