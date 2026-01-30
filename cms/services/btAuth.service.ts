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
  const btUrl = process.env.BUSINESS_TUNER_URL || 'https://businesstuner.voler.ai';
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY;

  if (!btApiKey) {
    console.error('BUSINESS_TUNER_API_KEY not configured');
    return { valid: false, error: 'Server configuration error' };
  }

  if (!connectionId) {
    console.error('Connection ID not provided');
    return { valid: false, error: 'Missing connection ID' };
  }

  try {
    const response = await fetch(`${btUrl}/api/cms/validate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btApiKey}`
      },
      body: JSON.stringify({
        token,
        connectionId
      })
    });

    const data = await response.json() as BTValidationResult;

    if (!response.ok) {
      console.error('BT validation failed:', data);
      return {
        valid: false,
        error: data.error || 'Validation failed'
      };
    }

    return data;

  } catch (error: any) {
    console.error('Error calling BT validation:', error.message);
    return {
      valid: false,
      error: 'Unable to contact Business Tuner'
    };
  }
}
