# Confianza Testnet MVP

The safest way to buy and sell crypto in Latin America. An open-source P2P marketplace building a community of trust through on-chain reputation.

## 🚀 Project Status

This is the **foundational bedrock** for the Confianza Testnet MVP. The project includes:

- ✅ Complete database architecture with security policies
- ✅ Next.js 14+ with App Router and TypeScript
- ✅ Tailwind CSS for styling
- ✅ Supabase integration with Row Level Security
- ✅ Clean component architecture
- ✅ Responsive design foundation

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel-ready
- **Blockchain:** Base Goerli Testnet

## 🏗 Architecture

```
src/
├── app/
│   ├── layout.tsx          # Main layout with Navbar/Footer
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation component
│   └── Footer.tsx          # Footer component
├── lib/
│   └── supabase.ts         # Supabase client
└── types/
    └── database.ts         # TypeScript database types
```

## 🔒 Database Schema

The complete database architecture includes:

- **profiles** - User profile information
- **admins** - Platform administrators
- **wallets** - User wallet addresses
- **trust_scores** - User reputation metrics
- **offers** - Trading offers
- **trades** - Trade transactions
- **disputes** - Dispute management
- **feedback** - User ratings and reviews

All tables have comprehensive Row Level Security (RLS) policies implemented.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd confianza-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/create_confianza_schema.sql`
   - Copy your project URL and anon key

4. **Configure environment variables**
   Create `.env.local` with your Supabase credentials:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

   # Database Configuration (for edge functions)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   # Next.js Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all database tables
- **Secure by default** - deny all access, then grant specific permissions
- **Admin controls** for platform management
- **User data isolation** - users can only access their own data
- **Public data controls** - careful exposure of necessary public information

## 🎯 Trust Score System

The platform implements a comprehensive trust scoring system:

- **Unverified** - New users (gray)
- **Bronze** - Basic verification (bronze)
- **Silver** - Established traders (silver)
- **Gold** - Highly trusted users (gold)

Trust scores are calculated based on:
- Total number of trades
- Success rate
- Dispute history
- Community feedback
- Trade volume

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tailwind CSS utilities
- Clean, professional design
- Accessibility considerations

## 🚀 Deployment

The project is configured for seamless deployment on Vercel:

```bash
npm run build
```

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌎 Mission

Building the safest P2P crypto trading platform for Latin America through:
- Transparent on-chain reputation
- Community-driven trust
- Open-source development
- Security-first approach

---

**Note:** This is a testnet implementation running on Base Goerli. No real money is handled in this version.