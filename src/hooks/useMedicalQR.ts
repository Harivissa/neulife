import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import QRCode from 'qrcode';

interface QRToken {
  id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}

export const useMedicalQR = () => {
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<QRToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateToken = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const fetchOrCreateQRToken = useCallback(async (hcid: string) => {
    if (!user) return null;

    setIsLoading(true);

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
        return null;
      }

      if (existingToken) {
        setQrToken(existingToken as QRToken);
        return existingToken.token;
      }

      // Create new token
      const newToken = generateToken();
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
        return null;
      }

      setQrToken(createdToken as QRToken);
      return newToken;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateQRCode = useCallback(async (hcid: string, baseUrl: string) => {
    const token = await fetchOrCreateQRToken(hcid);
    if (!token) return null;

    const qrUrl = `${baseUrl}/medical-summary/${token}`;
    
    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      
      setQrCodeUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }, [fetchOrCreateQRToken]);

  const disableQRToken = useCallback(async () => {
    if (!user || !qrToken) return false;

    const { error } = await supabase
      .from('medical_qr_tokens')
      .update({ is_active: false })
      .eq('id', qrToken.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error disabling QR token:', error);
      return false;
    }

    setQrToken(null);
    setQrCodeUrl(null);
    return true;
  }, [user, qrToken]);

  const regenerateQRToken = useCallback(async (hcid: string, baseUrl: string) => {
    // Disable existing token first
    await disableQRToken();
    // Generate new one
    return generateQRCode(hcid, baseUrl);
  }, [disableQRToken, generateQRCode]);

  // Validate a token (for the summary page)
  const validateToken = useCallback(async (token: string) => {
    const { data, error } = await supabase
      .from('medical_qr_tokens')
      .select('*, hcid')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Update last accessed timestamp
    await supabase
      .from('medical_qr_tokens')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', data.id);

    return data;
  }, []);

  return {
    qrCodeUrl,
    qrToken,
    isLoading,
    generateQRCode,
    disableQRToken,
    regenerateQRToken,
    validateToken,
  };
};
