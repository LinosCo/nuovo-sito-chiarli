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
  // Rimuovi spazi e trailing slash se presenti
  const btUrl = (process.env.BUSINESS_TUNER_URL || 'https://businesstuner.voler.ai').trim().replace(/\/$/, '');
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY?.trim();

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

  // Timeout di 15 secondi
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.error('[BT Auth] Request timeout after 15s - aborting');
    controller.abort();
  }, 15000);

  try {
    console.log('[BT Auth] Sending fetch request...');
    const startTime = Date.now();

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btApiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('[BT Auth] Response received in', Date.now() - startTime, 'ms');
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
    clearTimeout(timeoutId);

    console.error('[BT Auth] === FETCH ERROR ===');
    console.error('[BT Auth] Error name:', error.name);
    console.error('[BT Auth] Error message:', error.message);

    // In Node.js, error.cause contiene dettagli importanti
    if (error.cause) {
      console.error('[BT Auth] Error cause:', JSON.stringify(error.cause, null, 2));
      if (error.cause.code) {
        console.error('[BT Auth] Error cause code:', error.cause.code);
      }
      if (error.cause.hostname) {
        console.error('[BT Auth] Error cause hostname:', error.cause.hostname);
      }
    }

    // Determina il tipo di errore per un messaggio più utile
    let errorMessage = 'Unable to contact Business Tuner';

    if (error.name === 'AbortError') {
      console.error('[BT Auth] Request was aborted (timeout)');
      errorMessage = 'Request timeout - Business Tuner did not respond';
    } else if (error.message?.includes('ENOTFOUND') || error.cause?.code === 'ENOTFOUND') {
      console.error('[BT Auth] DNS resolution failed - cannot find host:', btUrl);
      errorMessage = 'Cannot resolve Business Tuner hostname';
    } else if (error.message?.includes('ECONNREFUSED') || error.cause?.code === 'ECONNREFUSED') {
      console.error('[BT Auth] Connection refused - server might be down');
      errorMessage = 'Business Tuner connection refused';
    } else if (error.message?.includes('certificate') || error.message?.includes('SSL') || error.cause?.code === 'CERT_HAS_EXPIRED') {
      console.error('[BT Auth] SSL/Certificate error');
      errorMessage = 'SSL certificate error';
    } else if (error.message?.includes('fetch failed')) {
      console.error('[BT Auth] Generic fetch failed - likely network issue');
      // Log più dettagli
      console.error('[BT Auth] Full error:', error);
    }

    console.error('[BT Auth] === END ERROR ===');

    return {
      valid: false,
      error: errorMessage
    };
  }
}
