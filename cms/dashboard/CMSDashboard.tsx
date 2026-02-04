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
  Lightbulb,
  Upload,
  ExternalLink,
  Plus,
  Newspaper,
  Home,
  Sparkles,
} from 'lucide-react';

// Configurazione API e Preview
const API_URL = import.meta.env.VITE_CMS_API_URL || '';
// URL sito produzione (Vercel) - usato anche per preview con ?cms_preview=true
const PRODUCTION_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
// Preview URL: usa il sito Vercel con parametro cms_preview
const PREVIEW_URL = `${PRODUCTION_URL}?cms_preview=true`;

console.log('🎯 [CMSDashboard] Componente caricato');
console.log('🔧 [CMSDashboard] API_URL:', API_URL);
console.log('🔧 [CMSDashboard] PREVIEW_URL:', PREVIEW_URL);
console.log('🔧 [CMSDashboard] PRODUCTION_URL:', PRODUCTION_URL);

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
  title: string;
  content: string;
  targetPage: string | null;
  type: string;
  contentType: string;
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  status: 'pending' | 'applied' | 'rejected';
  receivedAt: string;
}

interface User {
  email: string;
  permissions: string;
}

interface CMSDashboardProps {
  user?: User | null;
  onLogout?: () => void;
}

// Componente principale
export const CMSDashboard: React.FC<CMSDashboardProps> = ({ user, onLogout }) => {
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
  const [previewUrl, setPreviewUrl] = useState(PREVIEW_URL);
  const [showBTPanel, setShowBTPanel] = useState(false);
  const [btStatus, setBtStatus] = useState<BTStatus | null>(null);
  const [btSuggestions, setBtSuggestions] = useState<BTSuggestion[]>([]);
  const [loadingBT, setLoadingBT] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Scroll automatico
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listener per messaggi dall'iframe (selezione testo e navigazione)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // Traccia la pagina corrente
      if (event.data.type === 'CMS_PAGE_CHANGE') {
        setCurrentPage(event.data.page || '/');
      }

      // Gestisci selezione testo
      if (event.data.type === 'CMS_TEXT_SELECTED') {
        const selectedText = event.data.text;
        const page = event.data.page || currentPage || '/';
        const context = event.data.context || {};

        if (selectedText && selectedText.trim()) {
          // Apri la chat se non è aperta
          setChatOpen(true);

          // Costruisci un messaggio con il contesto strutturato per l'AI
          // Il contesto viene passato in modo che l'AI sappia esattamente dove fare la modifica
          let contextInfo = '';
          if (context.section || context.contentType || (page && page !== '/')) {
            const parts = [];
            if (context.section) parts.push(`sezione: ${context.section}`);
            if (context.contentType) parts.push(`tipo: ${context.contentType}`);
            if (page && page !== '/') parts.push(`pagina: ${page}`);
            contextInfo = ` [${parts.join(', ')}]`;
          }

          // Pre-compila l'input con il testo selezionato e il contesto
          setInputValue(`Sostituisci "${selectedText}"${contextInfo} con: `);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentPage]);

  // Pubblica le modifiche su Vercel (git push)
  const handlePublish = useCallback(async () => {
    if (publishing) return;

    setPublishing(true);
    try {
      const sessionToken = localStorage.getItem('cms_session');
      const res = await fetch(`${API_URL}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        setHasUnpublishedChanges(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Pubblicazione avviata! Il sito si aggiornerà in circa 1-2 minuti.\n\nCommit: ${data.commitHash || 'N/A'}`,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Errore pubblicazione: ${data.error}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Errore pubblicazione:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Errore durante la pubblicazione. Riprova più tardi.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setPublishing(false);
    }
  }, [publishing]);

  // Carica storia
  const loadHistory = useCallback(async () => {
    try {
      const sessionToken = localStorage.getItem('cms_session');
      const res = await fetch(`${API_URL}/api/history`, {
        headers: {
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include'
      });
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

  // Carica suggerimenti da API autenticata
  const loadSuggestions = useCallback(async () => {
    if (!showBTPanel) return;
    try {
      const res = await fetch(`${API_URL}/api/suggestions`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setBtSuggestions(data.suggestions.filter((s: BTSuggestion) => s.status === 'pending'));
      } else {
        console.error('Errore caricamento suggerimenti:', res.status);
      }
    } catch (error) {
      console.error('Errore connessione suggerimenti:', error);
    }
  }, [showBTPanel]);

  useEffect(() => {
    loadBTStatus();
    loadSuggestions();
  }, [showBTPanel, loadBTStatus, loadSuggestions]);

  // Applica suggerimento
  const applySuggestion = async (suggestion: BTSuggestion) => {
    try {
      // Prima applica via API
      const res = await fetch(`${API_URL}/api/suggestions/${suggestion.id}/apply`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Errore applicazione suggerimento');
      }

      // Inserisci il contenuto nella chat per farlo applicare
      const message = `Voglio applicare questo suggerimento da Business Tuner:

**${suggestion.title}**

${suggestion.content}

${suggestion.targetPage ? `Pagina target: ${suggestion.targetPage}` : ''}

Per favore, applica questo contenuto.`;

      setInputValue(message);

      // Rimuovi dalla lista
      setBtSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: `Suggerimento "${suggestion.title}" applicato. Business Tuner e stato notificato.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('Errore applicazione suggerimento:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: `Errore: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Rifiuta suggerimento
  const rejectSuggestion = async (suggestionId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/suggestions/${suggestionId}/reject`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Errore rifiuto suggerimento');
      }

      // Rimuovi dalla lista
      setBtSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    } catch (error: any) {
      console.error('Errore rifiuto suggerimento:', error);
    }
  };

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
      const sessionToken = localStorage.getItem('cms_session');

      // Aggiungi SEMPRE contesto della pagina corrente al messaggio
      // Mappa le route alle pagine contenuto
      const pageMap: Record<string, string> = {
        '/': 'home',
        '/storia': 'storia',
        '/metodo': 'metodo',
        '/sostenibilita': 'sostenibilita',
        '/esperienze': 'esperienze',
        '/blog': 'blog',
        '/tutti-i-vini': 'vini',
        '/tenute': 'tenute',
      };
      const pageName = pageMap[currentPage] || currentPage || 'home';
      const contextualMessage = `[L'utente sta visualizzando la pagina: ${pageName}] ${messageContent}`;

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include',
        body: JSON.stringify({
          message: contextualMessage,
          image: imageData?.base64 || null, // Invia immagine se presente
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Errore HTTP ${res.status}`);
      }

      const data = await res.json();

      // Verifica che la risposta contenga un messaggio valido
      if (!data.message || data.message.trim() === '') {
        console.error('Risposta API senza messaggio:', data);
        throw new Error('La risposta del server non contiene un messaggio valido');
      }

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
    } catch (error: any) {
      console.error('Errore:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: `Errore: ${error.message || 'Connessione fallita'}. Riprova tra qualche istante.`,
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
      const sessionToken = localStorage.getItem('cms_session');
      const res = await fetch(`${API_URL}/api/chat/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include',
        body: JSON.stringify({ action: message.action }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.success
            ? 'Fatto! La modifica e stata applicata. L\'anteprima si sta aggiornando...'
            : `Errore: ${data.error}`,
          timestamp: new Date(),
        },
      ]);

      // Ricarica l'iframe per mostrare le modifiche
      if (data.success) {
        setHasUnpublishedChanges(true);
        setTimeout(() => {
          const timestamp = Date.now();
          setPreviewUrl(`${PREVIEW_URL}&t=${timestamp}`);
        }, 300);
      }

      // Se è stata creata/aggiornata una pagina vino, naviga alla preview
      if (data.success && message.action.contentType === 'wines') {
        const wineSlug = data.data?.slug;
        if (wineSlug) {
          // Attendi un momento per essere sicuri che il file sia stato salvato
          setTimeout(() => {
            // Aggiorna l'iframe per mostrare la nuova pagina del vino con timestamp per evitare cache
            const timestamp = Date.now();
            setPreviewUrl(`${PREVIEW_URL}&t=${timestamp}#/vino/${wineSlug}`);
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

      const sessionToken = localStorage.getItem('cms_session');
      const res = await fetch(`${API_URL}/api/upload/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include',
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
          const chatSessionToken = localStorage.getItem('cms_session');
          const chatRes = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(chatSessionToken && { 'Authorization': `Bearer ${chatSessionToken}` })
            },
            credentials: 'include',
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
      const sessionToken = localStorage.getItem('cms_session');
      const res = await fetch(`${API_URL}/api/history/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
        },
        credentials: 'include',
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
      {/* Iframe preview */}
      <iframe
        key={previewUrl}
        src={previewUrl}
        className="w-full h-full border-0"
        title="Site Preview"
      />

      {/* Floating bubble button - hidden when chat is open */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-amber-900 text-white rounded-full shadow-2xl hover:bg-amber-800 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
          title="Apri Chat CMS"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat drawer - slides from right */}
      <div
        className={`fixed inset-y-0 right-0 w-[420px] bg-white transform transition-transform duration-500 ease-in-out z-40 shadow-2xl ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full bg-stone-100">
          {/* Sidebar Suggerimenti */}
          {showBTPanel && (
            <div className="w-80 bg-white border-r border-stone-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={20} className="text-amber-600" />
                    <h3 className="font-semibold text-stone-800">Suggerimenti</h3>
                    {btSuggestions.length > 0 && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {btSuggestions.length}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setShowBTPanel(false)} className="text-stone-400 hover:text-stone-600">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto p-4">
                {btSuggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb size={28} className="text-stone-400" />
                    </div>
                    <p className="text-stone-600 font-medium mb-1">Nessun suggerimento</p>
                    <p className="text-sm text-stone-400">I suggerimenti di Business Tuner appariranno qui</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {btSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              suggestion.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : suggestion.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {suggestion.priority === 'high' ? 'Urgente' : suggestion.priority === 'medium' ? 'Medio' : 'Basso'}
                          </span>
                          <span className="text-xs text-stone-400 bg-white px-2 py-1 rounded">{suggestion.contentType}</span>
                        </div>
                        <h5 className="font-semibold text-stone-800 mb-2">{suggestion.title}</h5>
                        {suggestion.targetPage && (
                          <p className="text-xs text-stone-500 mb-2 flex items-center gap-1">
                            <FileText size={12} />
                            {suggestion.targetPage}
                          </p>
                        )}
                        <p className="text-sm text-stone-600 mb-4 line-clamp-3">
                          {suggestion.content || suggestion.reasoning}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => applySuggestion(suggestion)}
                            className="flex-1 text-sm px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Applica
                          </button>
                          <button
                            onClick={() => rejectSuggestion(suggestion.id)}
                            className="px-3 py-2.5 bg-stone-200 text-stone-600 rounded-lg hover:bg-stone-300 transition-colors"
                            title="Ignora"
                          >
                            <X size={16} />
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
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header - compact */}
            <header className="bg-white border-b border-stone-200 px-3 py-2 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center">
                  <Wine className="text-white" size={16} />
                </div>
                <span className="font-semibold text-stone-800 text-sm">CMS</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Bottone Pubblica */}
                <button
                  onClick={handlePublish}
                  disabled={publishing || !hasUnpublishedChanges}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    hasUnpublishedChanges
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                  title={hasUnpublishedChanges ? 'Pubblica le modifiche' : 'Nessuna modifica'}
                >
                  {publishing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>Pubblica</span>
                </button>
                <a
                  href={PRODUCTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
                  title="Apri sito"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => { setShowHistory(!showHistory); setShowBTPanel(false); }}
                  className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'bg-amber-100 text-amber-700' : 'hover:bg-stone-100 text-stone-500'}`}
                  title="Cronologia"
                >
                  <History size={16} />
                </button>
                {onLogout && (
                  <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-red-100 text-stone-500 hover:text-red-600 transition-colors" title="Esci">
                    <X size={16} />
                  </button>
                )}
                <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors" title="Chiudi">
                  <ChevronRight size={16} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4 px-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 ${
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
            <div className="bg-white border-t border-stone-200 p-3">
              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />

              {/* Preview immagine allegata */}
              {attachedImage && (
                <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <Image size={14} className="text-amber-900 flex-shrink-0" />
                  <span className="text-xs text-amber-900 truncate flex-1">{attachedImage.name}</span>
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="p-1 hover:bg-amber-100 rounded transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-amber-700" />
                  </button>
                </div>
              )}

              {/* Input row */}
              <div className="flex items-end gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-3 py-2 bg-stone-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-900/20 text-sm"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 mt-2 mb-2 flex-wrap">
                <span className="text-xs text-stone-400 mr-1">Azioni rapide:</span>
                <button
                  onClick={() => setInputValue('Voglio aggiungere una nuova news')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 text-amber-800 rounded-full hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  <Plus size={12} />
                  <Newspaper size={12} />
                  News
                </button>
                <button
                  onClick={() => setInputValue('Voglio aggiungere un nuovo vino')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-800 rounded-full hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Plus size={12} />
                  <Wine size={12} />
                  Vino
                </button>
                <button
                  onClick={() => setInputValue('Modifica il titolo della hero in homepage')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <Home size={12} />
                  Hero
                </button>
                <button
                  onClick={() => setInputValue('Mostra tutti i vini disponibili')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <Wine size={12} />
                  Lista vini
                </button>
                <button
                  onClick={() => setInputValue('Mostra tutte le news')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <Newspaper size={12} />
                  Lista news
                </button>
              </div>

              {/* Upload buttons row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 hover:text-amber-900 hover:bg-stone-100 rounded transition-colors"
                >
                  {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Image size={14} />}
                  <span>Immagine</span>
                </button>
                <button
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 hover:text-amber-900 hover:bg-stone-100 rounded transition-colors"
                >
                  {uploadingPdf ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
