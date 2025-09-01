import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Search, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Image
            src="https://seeklogo.com/images/E/etsy-logo-68ADD687A5-seeklogo.com.png"
            width={40}
            height={40}
            alt="Etsy Logo"
            data-ai-hint="logo"
            className="invert"
          />
          <h1 className="text-2xl font-bold">Etsy Analyzer</h1>
        </div>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Enter Portal</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Unlock Your Etsy Potential
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Turn Etsy data into your competitive advantage. Analyze shops, research keywords, and discover profitable niches with powerful, AI-driven tools.
            </p>
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild className="group">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <section id="features" className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Tools for Etsy Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-border rounded-lg">
              <div className="flex justify-center mb-4">
                <BarChart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop & Competitor Analysis</h3>
              <p className="text-muted-foreground">
                Get a deep-dive into any Etsy shop's performance, track competitors, and compare key metrics side-by-side.
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Keyword & Niche Research</h3>
              <p className="text-muted-foreground">
                Discover high-potential keywords, analyze competition, and find profitable niches with AI-powered suggestions.
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <div className="flex justify-center mb-4">
                <Tag className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tag Generation</h3>
              <p className="text-muted-foreground">
                Automatically generate effective, SEO-friendly tags for your product listings based on their description.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-transparent z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Etsy Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
