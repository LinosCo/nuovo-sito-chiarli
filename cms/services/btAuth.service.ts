interface BTValidationResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    permissions: string;
  };
  project?: {
    id: string;
  };
  organization?: {
    id: string;
  };
  error?: string;
}

/**
 * Valida un token JWT chiamando l'API di Business Tuner
 * @param token - JWT token da validare
 * @param connectionId - ID della connessione CMS (da query params o env var)
 */
export async function validateBTToken(token: string, connectionId: string): Promise<BTValidationResult> {
  // Rimuovi trailing slash se presente
  const btUrl = (process.env.BUSINESS_TUNER_URL || 'https://businesstuner.voler.ai').replace(/\/$/, '');
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY;

  console.log('[BT Auth] === VALIDATION START ===');
  console.log('[BT Auth] BUSINESS_TUNER_URL env:', process.env.BUSINESS_TUNER_URL);
  console.log('[BT Auth] Final URL:', btUrl);
  console.log('[BT Auth] API Key configured:', btApiKey ? `${btApiKey.substring(0, 10)}...` : 'MISSING');
  console.log('[BT Auth] Connection ID:', connectionId);
  console.log('[BT Auth] Token length:', token?.length || 0);

  if (!btApiKey) {
    console.error('[BT Auth] ERROR: BUSINESS_TUNER_API_KEY not configured');
    return { valid: false, error: 'Server configuration error' };
  }

  if (!connectionId) {
    console.error('[BT Auth] ERROR: Connection ID not provided');
    return { valid: false, error: 'Missing connection ID' };
  }

  const requestUrl = `${btUrl}/api/cms/validate-session`;
  const requestBody = { token, connectionId };

  console.log('[BT Auth] Making request to:', requestUrl);
  console.log('[BT Auth] Request body:', {
    token: token.substring(0, 30) + '...',
    connectionId
  });

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[BT Auth] Response status:', response.status);
    console.log('[BT Auth] Response statusText:', response.statusText);

    const responseText = await response.text();
    console.log('[BT Auth] Response body (raw):', responseText.substring(0, 500));

    let data: BTValidationResult;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[BT Auth] ERROR: Failed to parse response as JSON');
      console.error('[BT Auth] Raw response:', responseText);
      return {
        valid: false,
        error: `Invalid response from Business Tuner: ${responseText.substring(0, 100)}`
      };
    }

    if (!response.ok) {
      console.error('[BT Auth] Validation failed with status', response.status);
      console.error('[BT Auth] Error data:', data);
      return {
        valid: false,
        error: data.error || `Validation failed (${response.status})`
      };
    }

    console.log('[BT Auth] Validation successful!');
    console.log('[BT Auth] User:', data.user?.email);
    console.log('[BT Auth] === VALIDATION END ===');

    return data;

  } catch (error: any) {
    console.error('[BT Auth] === FETCH ERROR ===');
    console.error('[BT Auth] Error name:', error.name);
    console.error('[BT Auth] Error message:', error.message);
    console.error('[BT Auth] Error cause:', error.cause);
    console.error('[BT Auth] Error stack:', error.stack);

    // Controlla errori specifici
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('[BT Auth] DNS resolution failed - check BUSINESS_TUNER_URL');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('[BT Auth] Connection refused - server might be down');
    } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
      console.error('[BT Auth] SSL/Certificate error');
    } else if (error.message.includes('timeout')) {
      console.error('[BT Auth] Request timeout');
    }

    return {
      valid: false,
      error: 'Unable to contact Business Tuner'
    };
  }
}
