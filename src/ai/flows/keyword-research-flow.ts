'use server';
/**
 * @fileOverview An AI flow for generating Etsy keyword ideas.
 *
 * - generateKeywordIdeas - A function that handles keyword idea generation.
 * - GenerateKeywordIdeasInput - The input type for the generateKeywordIdeas function.
 * - GenerateKeywordIdeasOutput - The return type for the generateKeywordIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateKeywordIdeasInputSchema = z.object({
  seedKeyword: z.string().describe('A primary keyword or product idea.'),
});
export type GenerateKeywordIdeasInput = z.infer<typeof GenerateKeywordIdeasInputSchema>;

const GenerateKeywordIdeasOutputSchema = z.object({
  relatedKeywords: z.array(z.string()).describe('An array of related and long-tail keywords for Etsy.'),
});
export type GenerateKeywordIdeasOutput = z.infer<typeof GenerateKeywordIdeasOutputSchema>;

export async function generateKeywordIdeas(input: GenerateKeywordIdeasInput): Promise<GenerateKeywordIdeasOutput> {
  return generateKeywordIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateKeywordIdeasPrompt',
  input: { schema: GenerateKeywordIdeasInputSchema },
  output: { schema: GenerateKeywordIdeasOutputSchema },
  prompt: `You are an expert in Etsy SEO and keyword research.

  Based on the following seed keyword, generate a list of 10-15 related and long-tail keywords that would be effective for an Etsy listing. The keywords should be a mix of popular search terms and more specific, less competitive phrases.

  Seed Keyword:
  {{{seedKeyword}}}`,
});

const generateKeywordIdeasFlow = ai.defineFlow(
  {
    name: 'generateKeywordIdeasFlow',
    inputSchema: GenerateKeywordIdeasInputSchema,
    outputSchema: GenerateKeywordIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
