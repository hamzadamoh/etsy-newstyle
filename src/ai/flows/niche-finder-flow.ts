'use server';
/**
 * @fileOverview An AI flow for generating Etsy niche ideas.
 *
 * - generateNicheIdeas - A function that handles niche idea generation.
 * - GenerateNicheIdeasInput - The input type for the generateNicheIdeas function.
 * - GenerateNicheIdeasOutput - The return type for the generateNicheIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNicheIdeasInputSchema = z.object({
  category: z.string().describe('A broad Etsy category, e.g., "Home & Living", "Jewelry", "Craft Supplies".'),
});
export type GenerateNicheIdeasInput = z.infer<typeof GenerateNicheIdeasInputSchema>;

const NicheIdeaSchema = z.object({
    niche: z.string().describe('A short, catchy name for the niche idea.'),
    description: z.string().describe('A brief explanation of the niche and why it has potential.'),
    keywords: z.array(z.string()).describe('A list of 3-5 relevant keywords for this niche.'),
});

const GenerateNicheIdeasOutputSchema = z.object({
  niches: z.array(NicheIdeaSchema).describe('An array of promising niche ideas.'),
});
export type GenerateNicheIdeasOutput = z.infer<typeof GenerateNicheIdeasOutputSchema>;

export async function generateNicheIdeas(input: GenerateNicheIdeasInput): Promise<GenerateNicheIdeasOutput> {
  return generateNicheIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNicheIdeasPrompt',
  input: { schema: GenerateNicheIdeasInputSchema },
  output: { schema: GenerateNicheIdeasOutputSchema },
  prompt: `You are an expert Etsy market analyst specializing in identifying emerging trends and profitable niches.

  Based on the following broad category, generate a list of 5 promising and specific niche ideas. For each idea, provide a catchy name, a brief description of the opportunity, and a few relevant keywords.

  Category:
  {{{category}}}`,
});

const generateNicheIdeasFlow = ai.defineFlow(
  {
    name: 'generateNicheIdeasFlow',
    inputSchema: GenerateNicheIdeasInputSchema,
    outputSchema: GenerateNicheIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
