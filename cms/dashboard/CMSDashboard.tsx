import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Image,
  History,
  Check,
  X,
  RotateCcw,
  Loader2,
  Wine,
  MapPin,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
  MessageCircle,
  Zap,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';

// Configurazione API - usa proxy di Vite in development
const API_URL = import.meta.env.VITE_CMS_API_URL || '';
const SITE_PREVIEW_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';

console.log('🎯 [CMSDashboard] Componente caricato');
console.log('🔧 [CMSDashboard] API_URL:', API_URL);
console.log('🔧 [CMSDashboard] SITE_PREVIEW_URL:', SITE_PREVIEW_URL);

// Tipi
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  preview?: string | null;
  timestamp: Date;
  action?: CMSAction | null;
  requiresConfirmation?: boolean;
  status?: 'pending' | 'confirmed' | 'rejected';
}

interface CMSAction {
  type: 'read' | 'update' | 'create' | 'delete';
  contentType: string;
  itemId: number | null;
  data: any;
}

interface HistoryEntry {
  hash: string;
  date: string;
  message: string;
  author: string;
}

interface BTStatus {
  connected: boolean;
  version: string;
  capabilities: string[];
  lastSync: string;
  cmsUrl: string;
  dashboardUrl: string;
}

interface BTSuggestion {
  id: string;
  type: string;
  contentType: string;
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  status: 'pending' | 'applied' | 'rejected';
  receivedAt: string;
}

// Componente principale
export const CMSDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Ciao! Sono il tuo assistente per la gestione del sito Chiarli. Posso aiutarti a:\n\n' +
        '- Modificare testi delle pagine\n' +
        '- Aggiungere o modificare vini\n' +
        '- Creare news e articoli\n' +
        '- Caricare immagini o screenshot per modifiche visive\n\n' +
        'Come posso aiutarti oggi?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ base64: string; name: string } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(SITE_PREVIEW_URL);
  const [showBTPanel, setShowBTPanel] = useState(false);
  const [btStatus, setBtStatus] = useState<BTStatus | null>(null);
  const [btSuggestions, setBtSuggestions] = useState<BTSuggestion[]>([]);
  const [loadingBT, setLoadingBT] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Scroll automatico
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Carica storia
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`);
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Errore caricamento storia:', error);
    }
  }, []);

  useEffect(() => {
    if (showHistory) loadHistory();
  }, [showHistory, loadHistory]);

  // Carica stato Business Tuner
  const loadBTStatus = useCallback(async () => {
    if (!showBTPanel) return;
    setLoadingBT(true);
    try {
      // Usa la stessa API key configurata nel backend
      const res = await fetch(`${API_URL}/api/integration/status`, {
        headers: {
          'Authorization': 'Bearer bt_test_12345'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setBtStatus(data);
      } else {
        console.error('Errore caricamento status BT:', res.status);
        setBtStatus(null);
      }
    } catch (error) {
      console.error('Errore connessione Business Tuner:', error);
      setBtStatus(null);
    } finally {
      setLoadingBT(false);
    }
  }, [showBTPanel]);

  useEffect(() => {
    loadBTStatus();
  }, [showBTPanel, loadBTStatus]);

  // Test webhook Business Tuner
  const testWebhook = async () => {
    setLoadingBT(true);
    try {
      const res = await fetch(`${API_URL}/api/integration/test-webhook`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer bt_test_12345',
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: data.success
            ? '✓ Test webhook inviato con successo a Business Tuner'
            : `✗ ${data.message || 'Errore invio webhook'}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('Errore test webhook:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: '✗ Business Tuner non configurato. Aggiungi BUSINESS_TUNER_WEBHOOK_URL e BUSINESS_TUNER_WEBHOOK_SECRET al file cms/.env per abilitare i webhook.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoadingBT(false);
    }
  };

  // Invia messaggio
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim() + (attachedImage ? ' [Screenshot allegato]' : ''),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    const imageData = attachedImage;
    setInputValue('');
    setAttachedImage(null); // Pulisci immagine allegata
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          image: imageData?.base64 || null, // Invia immagine se presente
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        preview: data.preview,
        timestamp: new Date(),
        action: data.action,
        requiresConfirmation: data.requiresConfirmation,
        status: data.requiresConfirmation ? 'pending' : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Errore:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: 'Errore di connessione. Riprova tra qualche istante.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Conferma azione
  const confirmAction = async (messageId: string, confirmed: boolean) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.action) return;

    // Aggiorna stato messaggio
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: confirmed ? 'confirmed' : 'rejected' } : m
      )
    );

    if (!confirmed) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Ok, operazione annullata. Come posso aiutarti?',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: message.action }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.success
            ? 'Fatto! La modifica e stata applicata. Il sito si aggiornerà automaticamente.'
            : `Errore: ${data.error}`,
          timestamp: new Date(),
        },
      ]);

      // Se è stata creata/aggiornata una pagina vino, naviga alla preview
      if (data.success && message.action.contentType === 'wines') {
        const wineSlug = data.data?.slug;
        if (wineSlug) {
          // Attendi un momento per essere sicuri che il file sia stato salvato
          setTimeout(() => {
            // Aggiorna l'iframe per mostrare la nuova pagina del vino con timestamp per evitare cache
            const timestamp = Date.now();
            setPreviewUrl(`${SITE_PREVIEW_URL}#/vino/${wineSlug}?t=${timestamp}`);
          }, 500);

          // Messaggio di conferma con link
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + '_preview',
              role: 'assistant',
              content: `La pagina del vino "${data.data.name}" è ora visibile nella preview a sinistra. Puoi vedere il risultato finale e modificarlo direttamente dalla chat.`,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload immagine
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'Per favore carica solo file immagine (PNG, JPG, ecc.)',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setUploadingImage(true);

    try {
      // Converti in base64 per Claude Vision API
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAttachedImage({
          base64: base64.split(',')[1], // Rimuovi il prefisso "data:image/..."
          name: file.name,
        });
        setUploadingImage(false);
        // Placeholder nel campo di testo per indicare che c'è un'immagine allegata
        if (!inputValue.trim()) {
          setInputValue('Puoi vedere cosa voglio modificare nello screenshot allegato?');
        }
      };
      reader.onerror = () => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: 'Errore nella lettura del file immagine',
            timestamp: new Date(),
          },
        ]);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Errore upload:', error);
      setUploadingImage(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Upload PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);

    try {
      // Leggi il file come ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      const res = await fetch(`${API_URL}/api/upload/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
        },
        body: arrayBuffer,
      });

      const data = await res.json();

      if (data.success) {
        // Invia il messaggio alla chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'user',
            content: `Ho caricato la scheda tecnica PDF: ${file.name}`,
            timestamp: new Date(),
          },
        ]);

        // Invia i dati estratti a Claude e lascia che risponda
        try {
          setIsLoading(true);
          const chatRes = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `Ho caricato una scheda tecnica PDF. Ecco i dati estratti:\n\n${JSON.stringify(data.extracted, null, 2)}\n\nMostra all'utente i dati estratti in modo chiaro e aspetta le sue istruzioni su cosa fare. NON creare automaticamente il vino, aspetta che l'utente lo richieda esplicitamente. Non usare emoji.`
            }),
          });

          if (!chatRes.ok) {
            throw new Error(`HTTP error! status: ${chatRes.status}`);
          }

          const chatData = await chatRes.json();

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: chatData.message,
            preview: chatData.preview,
            timestamp: new Date(),
            action: chatData.action,
            requiresConfirmation: chatData.requiresConfirmation,
            status: chatData.requiresConfirmation ? 'pending' : undefined,
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } catch (chatError) {
          console.error('Errore chiamata chat:', chatError);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'system',
              content: `Errore nella comunicazione con l'assistente: ${chatError instanceof Error ? chatError.message : 'Errore sconosciuto'}`,
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: `Errore caricamento PDF: ${data.error}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Errore upload PDF:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'Errore nel caricamento del PDF. Riprova.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  // Rollback
  const handleRollback = async (hash: string) => {
    if (!confirm(`Vuoi ripristinare la versione ${hash}? Questa operazione sovrascriverà i contenuti attuali.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/history/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitHash: hash }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: data.success
            ? `Contenuti ripristinati alla versione ${hash}`
            : `Errore rollback: ${data.error}`,
          timestamp: new Date(),
        },
      ]);

      setShowHistory(false);
    } catch (error) {
      console.error('Errore rollback:', error);
    }
  };

  // Icona per tipo contenuto
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'wines':
        return <Wine size={16} />;
      case 'tenute':
        return <MapPin size={16} />;
      case 'news':
        return <FileText size={16} />;
      case 'experiences':
        return <Calendar size={16} />;
      default:
        return <Settings size={16} />;
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fullscreen iframe preview */}
      <iframe
        key={previewUrl}
        src={previewUrl}
        className="w-full h-full border-0"
        title="Site Preview"
      />

      {/* Floating bubble button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-amber-900 text-white rounded-full shadow-2xl hover:bg-amber-800 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        title="Apri Chat CMS"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat drawer - slides from right */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[700px] transform transition-transform duration-500 ease-in-out z-40 shadow-2xl ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full bg-stone-100">
          {/* Sidebar Business Tuner */}
          {showBTPanel && (
            <div className="w-96 bg-white border-r border-stone-200 flex flex-col">
              <div className="p-4 border-b border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-amber-600" />
                    <h3 className="font-semibold text-stone-800">Business Tuner</h3>
                  </div>
                  <button onClick={() => setShowBTPanel(false)} className="text-stone-400 hover:text-stone-600">
                    <X size={20} />
                  </button>
                </div>

                {/* Connection Status */}
                {loadingBT ? (
                  <div className="flex items-center gap-2 text-stone-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Connessione...</span>
                  </div>
                ) : btStatus ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">Connesso</span>
                    </div>
                    <div className="text-xs text-stone-500 space-y-1">
                      <p>Versione: {btStatus.version}</p>
                      <p>Ultimo sync: {new Date(btStatus.lastSync).toLocaleString('it-IT')}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-medium text-stone-700 mb-2">Capabilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {btStatus.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded"
                          >
                            {cap.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={16} />
                    <span className="text-sm font-medium">Non connesso</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-b border-stone-200">
                <h4 className="text-sm font-medium text-stone-700 mb-3">Azioni</h4>
                <div className="space-y-2">
                  <button
                    onClick={testWebhook}
                    disabled={loadingBT || !btStatus}
                    className="w-full px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loadingBT ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Test in corso...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Test Webhook
                      </>
                    )}
                  </button>
                  <button
                    onClick={loadBTStatus}
                    disabled={loadingBT}
                    className="w-full px-3 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ricarica Stato
                  </button>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
                  <Lightbulb size={16} />
                  Suggerimenti
                </h4>
                {btSuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-stone-500">Nessun suggerimento disponibile</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {btSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 bg-stone-50 rounded-lg border border-stone-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              suggestion.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : suggestion.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {suggestion.priority}
                          </span>
                          <span className="text-xs text-stone-500">{suggestion.contentType}</span>
                        </div>
                        <p className="text-sm text-stone-700">{suggestion.reasoning}</p>
                        <div className="mt-2 flex gap-2">
                          <button className="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700">
                            Applica
                          </button>
                          <button className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded hover:bg-stone-300">
                            Rifiuta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sidebar Storia */}
          {showHistory && (
            <div className="w-80 bg-white border-r border-stone-200 flex flex-col">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Cronologia Modifiche</h3>
                <button onClick={() => setShowHistory(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {history.map((entry) => (
                  <div
                    key={entry.hash}
                    className="p-4 border-b border-stone-100 hover:bg-stone-50 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-800 truncate">{entry.message}</p>
                        <p className="text-xs text-stone-500 mt-1">
                          {new Date(entry.date).toLocaleString('it-IT')}
                        </p>
                        <p className="text-xs text-stone-400">{entry.author}</p>
                      </div>
                      <button
                        onClick={() => handleRollback(entry.hash)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-amber-600 transition-opacity"
                        title="Ripristina questa versione"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-900 rounded-lg flex items-center justify-center">
                  <Wine className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-semibold text-stone-800">CMS Chiarli</h1>
                  <p className="text-xs text-stone-500">Gestione contenuti</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewUrl(SITE_PREVIEW_URL)}
                  className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                  title="Torna alla home del sito"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button
                  onClick={() => {
                    setShowBTPanel(!showBTPanel);
                    setShowHistory(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showBTPanel ? 'bg-amber-100 text-amber-700' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                  title="Business Tuner"
                >
                  <Zap size={20} />
                </button>
                <button
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setShowBTPanel(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showHistory ? 'bg-amber-100 text-amber-700' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                  title="Cronologia modifiche"
                >
                  <History size={20} />
                </button>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                  title="Chiudi chat"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                        message.role === 'user'
                          ? 'bg-amber-900 text-white'
                          : message.role === 'system'
                          ? 'bg-stone-200 text-stone-700 text-sm'
                          : 'bg-white shadow-sm border border-stone-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {/* Preview della modifica */}
                      {message.preview && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-900 font-medium text-sm mb-2">
                            <MessageCircle size={16} />
                            Preview Modifica
                          </div>
                          <p className="text-sm text-stone-700 whitespace-pre-wrap">{message.preview}</p>
                        </div>
                      )}

                      {/* Azione pendente */}
                      {message.action && message.status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                            {getContentIcon(message.action.contentType)}
                            <span className="capitalize">{message.action.type}</span>
                            <ChevronRight size={14} />
                            <span className="capitalize">{message.action.contentType}</span>
                            {message.action.itemId && <span>#{message.action.itemId}</span>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmAction(message.id, true)}
                              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Check size={16} />
                              Conferma
                            </button>
                            <button
                              onClick={() => confirmAction(message.id, false)}
                              className="flex items-center gap-1 px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors text-sm"
                            >
                              <X size={16} />
                              Annulla
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Stato azione */}
                      {message.action && message.status === 'confirmed' && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                          <Check size={16} />
                          Confermato
                        </div>
                      )}
                      {message.action && message.status === 'rejected' && (
                        <div className="mt-3 flex items-center gap-2 text-stone-400 text-sm">
                          <X size={16} />
                          Annullato
                        </div>
                      )}

                      <p className="text-xs mt-2 opacity-50">
                        {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border border-stone-200 rounded-2xl px-5 py-3">
                      <Loader2 className="animate-spin text-amber-900" size={20} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-stone-200 px-6 py-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-3">
                  {/* Upload image button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="p-3 text-stone-400 hover:text-amber-900 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Carica immagine"
                  >
                    {uploadingImage ? <Loader2 className="animate-spin" size={20} /> : <Image size={20} />}
                  </button>

                  {/* Upload PDF button */}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="p-3 text-stone-400 hover:text-amber-900 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Carica scheda tecnica PDF"
                  >
                    {uploadingPdf ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                  </button>

                  {/* Input text */}
                  <div className="flex-1 relative">
                    {/* Preview immagine allegata */}
                    {attachedImage && (
                      <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                        <Image size={16} className="text-amber-900" />
                        <span className="text-sm text-amber-900 flex-1">{attachedImage.name}</span>
                        <button
                          onClick={() => setAttachedImage(null)}
                          className="p-1 hover:bg-amber-100 rounded transition-colors"
                          title="Rimuovi screenshot"
                        >
                          <X size={16} className="text-amber-700" />
                        </button>
                      </div>
                    )}
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder={attachedImage ? "Descrivi cosa vuoi modificare nello screenshot..." : "Scrivi un messaggio... (es: 'Aggiungi un nuovo vino', 'Cambia il titolo della homepage')"}
                      className="w-full px-4 py-3 bg-stone-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-900/20 max-h-32"
                      rows={1}
                    />
                  </div>

                  {/* Send button */}
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-3 bg-amber-900 text-white rounded-xl hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Mostra tutti i vini', 'Aggiungi una news', 'Modifica contatti', 'Vedi tenute'].map(
                    (action) => (
                      <button
                        key={action}
                        onClick={() => setInputValue(action)}
                        className="px-3 py-1 text-xs bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
                      >
                        {action}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
