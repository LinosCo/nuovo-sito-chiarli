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
} from 'lucide-react';

// Configurazione API
const API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:3001';
const SITE_PREVIEW_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';

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
        '- Caricare immagini\n\n' +
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
  const [chatOpen, setChatOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(SITE_PREVIEW_URL);

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

  // Invia messaggio
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
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

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/upload/gallery`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: `Immagine caricata: ${data.url}`,
            timestamp: new Date(),
          },
        ]);
        // Aggiungi l'URL all'input per permettere di associarla
        setInputValue(`Usa l'immagine ${data.url} per `);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: `Errore upload: ${data.error}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Errore upload:', error);
    } finally {
      setUploadingImage(false);
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
                  onClick={() => setShowHistory(!showHistory)}
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
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Scrivi un messaggio... (es: 'Aggiungi un nuovo vino', 'Cambia il titolo della homepage')"
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
