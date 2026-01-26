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
 */
export async function validateBTToken(token: string): Promise<BTValidationResult> {
  const btUrl = process.env.BUSINESS_TUNER_URL || 'https://app.businesstuner.io';
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY;
  const connectionId = process.env.BUSINESS_TUNER_CONNECTION_ID;

  if (!btApiKey) {
    console.error('BUSINESS_TUNER_API_KEY not configured');
    return { valid: false, error: 'Server configuration error' };
  }

  if (!connectionId) {
    console.error('BUSINESS_TUNER_CONNECTION_ID not configured');
    return { valid: false, error: 'Server configuration error' };
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
