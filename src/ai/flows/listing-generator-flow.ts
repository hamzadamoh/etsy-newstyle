'use server';
/**
 * @fileOverview An AI flow for generating a complete Etsy listing (title, description, tags).
 *
 * - generateListing - A function that handles the listing generation.
 * - GenerateListingInput - The input type for the generateListing function.
 * - GenerateListingOutput - The return type for the generateListing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateListingInputSchema = z.object({
  productIdea: z.string().describe('A brief description of the product idea or concept.'),
});
export type GenerateListingInput = z.infer<typeof GenerateListingInputSchema>;

const GenerateListingOutputSchema = z.object({
  title: z.string().describe('An SEO-friendly and compelling title for the Etsy listing.'),
  description: z.string().describe('A detailed and persuasive product description, formatted for readability on Etsy.'),
  tags: z.array(z.string()).length(13).describe('An array of exactly 13 relevant Etsy tags.'),
});
export type GenerateListingOutput = z.infer<typeof GenerateListingOutputSchema>;

export async function generateListing(input: GenerateListingInput): Promise<GenerateListingOutput> {
  return generateListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingPrompt',
  input: { schema: GenerateListingInputSchema },
  output: { schema: GenerateListingOutputSchema },
  prompt: `You are an expert Etsy copywriter and SEO specialist. Your task is to create a complete, high-converting Etsy listing based on a simple product idea.

  Given the following product idea, generate:
  1.  A compelling, keyword-rich title that grabs attention and is optimized for Etsy search.
  2.  A detailed and persuasive product description. Use clear headings and bullet points to make it easy to read. Highlight the key features and benefits for the customer.
  3.  Exactly 13 relevant and effective tags, mixing broad and long-tail keywords to maximize visibility.

  Product Idea:
  {{{productIdea}}}`,
});

const generateListingFlow = ai.defineFlow(
  {
    name: 'generateListingFlow',
    inputSchema: GenerateListingInputSchema,
    outputSchema: GenerateListingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
