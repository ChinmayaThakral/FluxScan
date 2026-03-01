# FluxScan

**generate. scan. done.**

A premium, offline-ready UPI QR code generator built as a Progressive Web App. No backend, no authentication, no data stored — pure client-side.

## Features

- Generate valid UPI QR codes from any UPI ID (VPA)
- Optional amount field with validation
- High-resolution QR download as PNG with FluxScan branding
- Copy UPI deep link to clipboard
- Fully offline after first load (PWA with service worker)
- Installable on Android and iOS
- Dark fintech-inspired design

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- `qrcode` for QR generation
- `vite-plugin-pwa` for offline support
- `lucide-react` for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone <your-repo-url>
cd FluxScan
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Deploying to Vercel

1. Push the repository to GitHub.

2. Go to [vercel.com](https://vercel.com), import the repository.

3. Vercel auto-detects Vite. Use these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Click **Deploy**.

Alternatively, deploy via the Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main application component
├── sw.ts                 # Service worker (precache)
├── vite-env.d.ts
├── components/
│   ├── Header.tsx        # Logo and tagline
│   ├── InputField.tsx    # Reusable input component
│   ├── Buttons.tsx       # Reusable button component
│   └── QRCard.tsx        # QR display, copy, download
├── utils/
│   ├── buildUpi.ts       # UPI deep link builder
│   └── validateUpi.ts    # UPI ID and amount validation
└── styles/
    └── globals.css       # Tailwind config, theme, animations
```

## License

MIT
