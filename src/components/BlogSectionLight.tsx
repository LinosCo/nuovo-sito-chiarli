import React, { useState, useEffect, useRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { useNews } from "../hooks/useContent";

export const BlogSectionLight: React.FC = () => {
  const { news } = useNews();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (news.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="blog"
      data-section="blog"
      data-content-type="news"
      className="py-24 md:py-32 bg-white relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 50% 40% at ${hoveredArticle !== null ? 20 + (hoveredArticle % 3) * 30 : 50}% 50%, rgba(180,60,80,0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              left: `${3 + ((i * 3) % 94)}%`,
              top: `${5 + ((i * 5) % 90)}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(87,15,26,${0.2 + (i % 4) * 0.08}), rgba(87,15,26,${0.1}))`,
              animation: `float ${15 + (i % 10) * 3}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 15}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mb-16">
          <span
            className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-4 block transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Storie e Tradizione
          </span>
          <h2
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-chiarli-text leading-[1.1] mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Il nostro <span className="italic text-chiarli-wine">Blog</span>
          </h2>
          <p
            className={`text-chiarli-text/70 text-base md:text-lg leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Scopri le storie, le tradizioni e le novità dalla cantina Chiarli
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(0, 6).map((article, index) => (
            <a
              key={article.id}
              href="#/blog"
              className={`group cursor-pointer transition-all duration-700 delay-${index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              onMouseEnter={() => setHoveredArticle(index)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-stone-100">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 opacity-10">
                      <svg
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        className="text-chiarli-text"
                      >
                        <circle cx="50" cy="50" r="40" />
                      </svg>
                    </div>
                  </div>
                )}
                {/* Overlay base per leggibilità */}
                <div className="absolute inset-0 bg-gradient-to-t from-chiarli-text/70 via-chiarli-text/30 to-transparent" />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-chiarli-text/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {article.tags.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-chiarli-wine backdrop-blur-sm text-white text-xs font-sans uppercase tracking-wider px-3 py-1 rounded-full">
                      {article.tags[0]}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div
                  className="flex items-center gap-4 mb-3 text-sm"
                  style={{ color: "#1C1917" }}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>

                <h3
                  className="font-serif text-2xl mb-3 leading-tight group-hover:text-chiarli-wine transition-colors duration-300"
                  style={{ color: "#1C1917" }}
                >
                  {article.title}
                </h3>

                <p
                  className="text-base mb-4 leading-relaxed line-clamp-2"
                  style={{ color: "#1C1917" }}
                >
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-2 text-chiarli-wine group-hover:gap-3 transition-all duration-300">
                  <span className="text-sm font-sans uppercase tracking-wider">
                    Leggi di più
                  </span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
      `}</style>
    </section>
  );
};
