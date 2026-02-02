import React from 'react';

interface AccessDeniedProps {
  error?: string | null;
  isLoading?: boolean;
}

export function AccessDenied({ error, isLoading }: AccessDeniedProps) {
  const btUrl = import.meta.env.VITE_BUSINESS_TUNER_URL || 'https://businesstuner.voler.ai';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Verifica accesso in corso...
          </h1>
          <p className="text-stone-500">
            Connessione a Business Tuner
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          {/* Shield Icon */}
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Accesso Richiesto
          </h1>
          <p className="text-stone-500">
            Per accedere al CMS devi autenticarti tramite Business Tuner.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            {/* Alert Icon */}
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Errore di autenticazione</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <a
            href={btUrl}
            className="inline-flex bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-xl items-center justify-center gap-2 transition-colors"
          >
            Accedi da Business Tuner
            {/* External Link Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200">
          <p className="text-xs text-stone-400 text-center leading-relaxed">
            Il CMS Chiarli è integrato con Business Tuner per garantire
            la sicurezza dei tuoi contenuti. Solo gli utenti autorizzati
            possono accedere.
          </p>
        </div>
      </div>
    </div>
  );
}
