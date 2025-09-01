import Image from 'next/image';
import { EtsyAnalyzerPage } from '@/components/etsy-analyzer-page';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 flex flex-col items-center">
        <Image
          src="https://seeklogo.com/images/E/etsy-logo-68ADD687A5-seeklogo.com.png"
          width={80}
          height={80}
          alt="Etsy Logo"
          data-ai-hint="logo"
        />
        <h1 className="text-4xl font-bold mt-4 font-headline">Etsy Product Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Enter a store name and filters to analyze its products.
        </p>
      </header>
      <EtsyAnalyzerPage />
       <footer className="text-center mt-12 text-sm text-muted-foreground no-print">
        <p>EtsyProduct copyright © 2024. All rights reserved.</p>
      </footer>
    </main>
  );
}
