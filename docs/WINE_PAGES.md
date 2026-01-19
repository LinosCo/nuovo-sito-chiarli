# Pagine Vino - Istruzioni e Configurazione

## Layout e Impostazioni Default

Quando si crea una nuova pagina vino, utilizzare le seguenti impostazioni di default già implementate in `WineDetailPage.tsx`:

### 1. Hero Section
- **Layout**: Split layout (50/50) - contenuto a sinistra, bottiglia a destra
- **Background**: Sfondo scuro con immagine sfocata di uve
- **Effetti**:
  - Parallax leggero sullo sfondo
  - Bolle di vino animate che salgono
  - Effetto glow sulla bottiglia (drop-shadow con colori rosa/rosso)
  - Trasformazione 3D della bottiglia al mouse hover
- **Contenuto**:
  - Badge categoria in alto
  - Titolo grande (prima parte normale, ultima parola in italic)
  - Denominazione in piccolo
  - Descrizione
  - Gradazione alcolica e temperatura di servizio
  - CTA "Acquista Online"
- **Mobile**: Bottiglia mostrata in alto, contenuto sotto

### 2. Tasting Notes Section
- **Background**: Scuro con immagine parallax di vigneto
- **Layout**: Grid con 3 tab (Aspetto, Profumo, Gusto)
- **Effetti**: Animazione al cambio tab

### 3. Awards Section
- **Condizione**: Mostrare solo se `wine.awards.length > 0`
- **Layout**: Grid 2x2 o 4 colonne su desktop
- **Effetti**: Hover con glow e scale

### 4. Food Pairing Section
- **Layout**: Split 50/50 - immagine a sinistra, contenuto a destra
- **Contenuto**: Lista di abbinamenti con bullet animati

### 5. CTA Section
- **Background**: Scuro con gradiente radiale
- **Contenuto**: Titolo, descrizione, bottone CTA

### 6. Related Wines Section
- **Condizione**: Mostrare solo se `relatedWines.length > 0`
- **Background**: Bianco
- **Layout**: Grid 3 colonne su desktop, 1 su mobile
- **Logica**:
  - Cerca vini con stesso `family` O stessa `denomination`
  - Escludi il vino corrente
  - Massimo 3 vini correlati
  - Solo vini con `isActive: true`
- **Contenuto per ogni vino**:
  - Immagine bottiglia (h-80 md:h-96)
  - Badge family
  - Nome vino
  - Denominazione
  - Linea separatrice animata
  - CTA "Scopri"
- **Interazione**: Click su vino correlato → navigazione con hash

## Container e Spacing

### Overflow e Glow
```javascript
// Hero section
className="overflow-x-hidden" // Permette glow verticale

// Container bottiglia
className="overflow-visible p-12" // Spazio per glow
```

### Padding e Max-Width
- Hero content: `px-6 md:px-16 lg:px-20`
- Sections: `max-w-[1400px]` o `max-w-[1200px]` centrato
- Mobile: `px-4 md:px-6 lg:px-12`

## Animazioni

### 1. Bolle di Vino
```css
@keyframes bubble-rise {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.4; }
  50% { transform: translateY(-50vh); opacity: 0.3; }
  100% { transform: translateY(-110vh); opacity: 0; }
}
```

### 2. Fade-in al Caricamento
- Tutti gli elementi usano `isLoaded` state
- Delay progressivi: 300ms, 400ms, 500ms, etc.
- Transizioni: `opacity` e `translateY`

### 3. Parallax
- Background images: `transform: translateY(${scrollY * 0.15}px)`
- Floating awards: `transform: translateY(${Math.sin(scrollY * 0.01) * 10}px)`

## Colori e Tipografia

### Colori
- **Background scuro**: `bg-chiarli-text`
- **Background chiaro**: `bg-white` o `bg-chiarli-stone`
- **Accent**: `text-chiarli-wine` / `text-chiarli-wine-light`
- **Glow**: `rgba(200,100,120,0.25)` → `rgba(180,80,100,0.2)`

### Tipografia
- **Titoli**: `font-serif text-3xl md:text-5xl lg:text-6xl`
- **Label**: `font-sans text-[10px] font-bold uppercase tracking-widest`
- **Body**: `font-serif text-base md:text-lg`

## Dati Vino (wines.json)

### Struttura Base
```json
{
  "id": 1,
  "slug": "nome-vino",
  "name": "Nome Vino",
  "denomination": "Lambrusco DOC",
  "family": "Premium",
  "description": "Descrizione...",
  "image": "/foto/vino.png",
  "format": "0.75L",
  "tags": ["Premium", "DOC"],
  "price": null,
  "year": null,
  "alcohol": 11.5,
  "servingTemp": "12-14°C",
  "pairings": ["Piatto 1", "Piatto 2"],
  "awards": [
    { "name": "Premio", "score": "95/100", "years": "2023" }
  ],
  "tastingNotes": {
    "aspetto": "Descrizione aspetto",
    "profumo": "Descrizione profumo",
    "gusto": "Descrizione gusto"
  },
  "isActive": true,
  "order": 1
}
```

### Note Importanti
- **family**: Usato per vini correlati (es: "Premium", "Metodo Classico")
- **denomination**: Usato per vini correlati se diverso da family
- **isActive**: DEVE essere `true` per mostrare il vino e per apparire nei correlati
- **image**: Path relativo da `/public` (es: `/foto/nome.png`)
- **slug**: Usato nell'URL (`#/vino/slug`)

## Vini Correlati - Troubleshooting

Se i vini correlati non appaiono:
1. Verificare che esistano altri vini con stesso `family` O `denomination`
2. Verificare che gli altri vini abbiano `isActive: true`
3. Verificare che lo `slug` del vino corrente non sia incluso nei correlati
4. Minimo 1 vino, massimo 3 vini correlati vengono mostrati

## Best Practices

1. **Immagini Bottiglia**:
   - Dimensione consigliata: 720x1080px
   - Formato: PNG con trasparenza
   - Peso: < 200KB ottimizzato

2. **Performance**:
   - Usare cache busting per wines.json: `?t=${timestamp}`
   - Lazy load immagini di background
   - Ottimizzare animazioni con `will-change` quando necessario

3. **Accessibilità**:
   - Alt text su tutte le immagini
   - Contrasto testo/background adeguato
   - Focus states su elementi interattivi

4. **Mobile**:
   - Bottiglia mostrata in alto con dimensione ridotta
   - Stack verticale per tutte le sezioni
   - Touch-friendly spacing (min 44x44px per bottoni)
