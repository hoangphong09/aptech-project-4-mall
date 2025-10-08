# ATlogistics E-commerce Clone

A modern e-commerce platform clone built with Next.js 14, featuring real-time product data from 1688 API.

## Features

- 🛍️ Product recommendations and suggestions
- ⚡ Flash sales with countdown timer
- 🏷️ Brand sections with multiple categories
- 📱 Fully responsive design
- 🎨 Vintage-inspired aesthetic
- 🔄 Real-time product data from TMAPI
- 🔒 Secure API token handling (server-side only)
- 🛡️ Graceful fallback to mock data when API is unavailable

## Getting Started

### Prerequisites

- Node.js 18+ installed
- TMAPI account and API token (optional - works with mock data without token)

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. (Optional) Create a `.env.local` file and add your TMAPI token:
\`\`\`
TMAPI_TOKEN=your_api_token_here
\`\`\`

**Note:** The app will work with mock data if no API token is provided. Get your API token from [TMAPI Console](https://console.tmapi.io/account/center)

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

This project uses the TMAPI 1688 Product Details API to fetch real product data. The API integration is secure with the token stored server-side only.

### Security

- API token is stored in `TMAPI_TOKEN` (without `NEXT_PUBLIC_` prefix)
- All API calls go through `/api/products` route handler
- Token is never exposed to the client
- Falls back to mock data if no token is configured or API fails

### Error Handling

The app includes robust error handling:
- Timeout protection (10 seconds for server, 15 seconds for client)
- Content-type validation before JSON parsing
- Automatic fallback to mock data on API failures
- Detailed error logging for debugging

### API Configuration

The API integration is configured in:
- `app/api/products/route.ts` - Server-side API route handler with error handling
- `lib/api.ts` - Client-side API wrapper with timeout protection

### Sample Product IDs

The app uses sample product IDs defined in `SAMPLE_PRODUCT_IDS`. Replace these with actual 1688 product IDs for real data.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts   # Secure API route handler
│   ├── page.tsx           # Main homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with vintage theme
├── components/
│   ├── header.tsx         # Top navigation with search
│   ├── hero-section.tsx   # Hero banners with sidebar
│   ├── product-recommendations.tsx
│   ├── flash-sales.tsx
│   ├── brand-section.tsx
│   ├── product-grid.tsx
│   └── footer.tsx
└── lib/
    └── api.ts             # Client-side API wrapper
\`\`\`

## Environment Variables

Add these to your `.env.local` file or in the v0 Project Settings:

- `TMAPI_TOKEN` - Your TMAPI API token (server-side only, optional)

**In v0:** Click the gear icon (⚙️) in the top right → Environment Variables → Add `TMAPI_TOKEN`

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **TMAPI** - Product data API
- **SWR** - Data fetching and caching

## Troubleshooting

### API Returns HTML Instead of JSON

If you see errors about "Unexpected token '<'", this means:
- The API token might be invalid or expired
- The API endpoint might be temporarily unavailable
- The app will automatically fall back to mock data

### No Products Showing

- Check if `TMAPI_TOKEN` is set correctly in environment variables
- Verify your API token is active in [TMAPI Console](https://console.tmapi.io/account/center)
- The app will show mock data if the API is unavailable

## License

MIT
