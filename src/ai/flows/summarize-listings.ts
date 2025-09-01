'use server';

/**
 * @fileOverview Summarizes a list of Etsy listings.
 *
 * - summarizeListings - A function that summarizes the provided listings.
 * - SummarizeListingsInput - The input type for the summarizeListings function.
 * - SummarizeListingsOutput - The return type for the summarizeListings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeListingsInputSchema = z.object({
  listings: z
    .string()
    .describe('A list of etsy listings to be summarized.'),
});
export type SummarizeListingsInput = z.infer<typeof SummarizeListingsInputSchema>;

const SummarizeListingsOutputSchema = z.object({
  summary: z.string().describe('A summary of the listings.'),
});
export type SummarizeListingsOutput = z.infer<typeof SummarizeListingsOutputSchema>;

export async function summarizeListings(input: SummarizeListingsInput): Promise<SummarizeListingsOutput> {
  return summarizeListingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeListingsPrompt',
  input: {schema: SummarizeListingsInputSchema},
  output: {schema: SummarizeListingsOutputSchema},
  prompt: `You are an expert Etsy listings summarizer.

  You will receive a list of Etsy listings and provide a concise summary of the listings.

  Listings: {{{listings}}}`,
});

const summarizeListingsFlow = ai.defineFlow(
  {
    name: 'summarizeListingsFlow',
    inputSchema: SummarizeListingsInputSchema,
    outputSchema: SummarizeListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
