import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNews } from '../hooks/useContent';

interface BlogPageProps {
  onBack?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const { news } = useNews();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Raccogli tutti i tag unici
  const allTags = Array.from(new Set(news.flatMap(article => article.tags)));

  // Filtra articoli per tag
  const filteredNews = selectedTag
    ? news.filter(article => article.tags.includes(selectedTag))
    : news;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/1.jpg"
            alt="Blog Chiarli"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay - More intense */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55" />
          {/* Additional center vignette */}
          <div className="absolute inset-0 bg-radial-gradient-center" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          {/* Label */}
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Storie e Tradizione
          </span>

          {/* Title with text shadow */}
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-8 leading-none animate-fade-in-up" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
            Il nostro <span className="italic" style={{ color: '#E08C9A' }}>Blog</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)' }}>
            Scopri le storie, le tradizioni e le novità dalla cantina Chiarli
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <style>{`
          .bg-radial-gradient-center {
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}</style>
      </section>

      {/* Blog Articles Section */}
      <section ref={sectionRef} className="py-24 md:py-32 bg-chiarli-text relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse 50% 40% at ${hoveredArticle !== null ? 20 + (hoveredArticle % 3) * 30 : 50}% 50%, rgba(87,15,26,0.15) 0%, transparent 70%)`,
          }}
        />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">

          {/* Filter Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-16 justify-center">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-6 py-2 rounded-full font-sans text-sm uppercase tracking-wider transition-all duration-300 ${
                  selectedTag === null
                    ? 'bg-chiarli-wine-light text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Tutti
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-6 py-2 rounded-full font-sans text-sm uppercase tracking-wider transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-chiarli-wine-light text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <article
                key={article.id}
                className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredArticle(index)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-white/5">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 opacity-20">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                          <circle cx="50" cy="50" r="40" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-chiarli-text/70 via-chiarli-text/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-chiarli-wine/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {article.tags.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-chiarli-wine-light/90 backdrop-blur-sm text-white text-xs font-sans uppercase tracking-wider px-3 py-1 rounded-full">
                        {article.tags[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <span>•</span>
                    <span>{article.author}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-white mb-3 leading-tight group-hover:text-chiarli-wine-light transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-white/70 text-base mb-4 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-chiarli-wine-light group-hover:gap-3 transition-all duration-300">
                    <span className="text-sm font-sans uppercase tracking-wider">Leggi di più</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No results */}
          {filteredNews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50 text-lg">Nessun articolo trovato per questa categoria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
