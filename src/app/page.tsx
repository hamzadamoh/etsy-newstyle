import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <Button asChild variant="outline" className="bg-transparent hover:bg-primary/10 hover:text-primary-foreground">
            <Link href="/dashboard">Enter Portal</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow flex items-center">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-400">
            Navigate the Dimensions of Etsy Data
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Our generative UI transforms complex market data into clear, interactive insights. Move beyond static charts and explore the dynamic forces shaping your Etsy business.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild className="group bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300">
              <Link href="/dashboard">
                Begin Dimensional Shift
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-transparent z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Dimensional Insights Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

    