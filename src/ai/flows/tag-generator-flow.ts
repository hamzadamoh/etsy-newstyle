'use server';
/**
 * @fileOverview An AI flow for generating Etsy product tags.
 *
 * - generateTags - A function that handles tag generation.
 * - GenerateTagsInput - The input type for the generateTags function.
 * - GenerateTagsOutput - The return type for the generateTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTagsInputSchema = z.object({
  productDescription: z.string().describe('A description of the Etsy product.'),
});
export type GenerateTagsInput = z.infer<typeof GenerateTagsInputSchema>;

const GenerateTagsOutputSchema = z.object({
  tags: z.array(z.string()).length(13).describe('An array of 13 relevant Etsy tags.'),
});
export type GenerateTagsOutput = z.infer<typeof GenerateTagsOutputSchema>;

export async function generateTags(input: GenerateTagsInput): Promise<GenerateTagsOutput> {
  return generateTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTagsPrompt',
  input: { schema: GenerateTagsInputSchema },
  output: { schema: GenerateTagsOutputSchema },
  prompt: `You are an expert in Etsy SEO and marketing.
  
  Based on the following product description, generate exactly 13 relevant and effective tags for an Etsy listing. The tags should be a mix of broad and long-tail keywords to maximize visibility. Ensure the tags are concise and directly related to the product.

  Product Description:
  {{{productDescription}}}`,
});

const generateTagsFlow = ai.defineFlow(
  {
    name: 'generateTagsFlow',
    inputSchema: GenerateTagsInputSchema,
    outputSchema: GenerateTagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
