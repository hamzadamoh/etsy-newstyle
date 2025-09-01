import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Image
            src="https://seeklogo.com/images/E/etsy-logo-68ADD687A5-seeklogo.com.png"
            width={40}
            height={40}
            alt="Etsy Logo"
            data-ai-hint="logo"
          />
          <h1 className="text-2xl font-bold">Etsy Product Analyzer</h1>
        </div>
        <nav>
          <Button asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Unlock Data-Driven Insights for Your Etsy Shop
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our suite of tools provides everything you need for market research, competitor analysis, and listing optimization to help you grow your business.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Shop Analyzer</h3>
              <p className="mt-2 text-muted-foreground">
                Perform a deep-dive analysis of any Etsy shop. Useful for analyzing your own shop or competitors.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Keyword Research</h3>
              <p className="mt-2 text-muted-foreground">
                Discover and evaluate the potential of keywords to find profitable niches.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Tag Generator</h3>
              <p className="mt-2 text-muted-foreground">
                Quickly generate a list of relevant, high-performing tags for your product listings.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Etsy Product Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
