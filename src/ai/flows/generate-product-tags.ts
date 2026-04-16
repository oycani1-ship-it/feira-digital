'use server';
/**
 * @fileOverview An AI agent to generate relevant tags and categories for a product.
 *
 * - generateProductTags - A function that handles the product tag and category generation process.
 * - GenerateProductTagsInput - The input type for the generateProductTags function.
 * - GenerateProductTagsOutput - The return type for the generateProductTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const availableCategories = [
  'Alimentação',
  'Acessórios',
  'Bijouterias e Joias',
  'Bolsas e Couros',
  'Brinquedos e Bonecas',
  'Cama/Mesa/Banho',
  'Cerâmicas',
  'Confecção Feminina',
  'Confecção Infantil',
  'Decoração',
  'Doces e Salgados',
  'Fantasias',
  'Moda Artesanal',
  'Móveis e Puffs',
  'Quadros e Molduras',
  'Roupas',
  'Sapatos e Calçados',
  'Tapetes e Redes',
  'Velas Decorativas',
  'Outros'
];

const GenerateProductTagsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The detailed description of the product.')
});
export type GenerateProductTagsInput = z.infer<typeof GenerateProductTagsInputSchema>;

const GenerateProductTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags for the product, up to 10.'),
  category: z.enum(availableCategories as [string, ...string[]]).describe('The most relevant category for the product from the predefined list.')
});
export type GenerateProductTagsOutput = z.infer<typeof GenerateProductTagsOutputSchema>;

export async function generateProductTags(input: GenerateProductTagsInput): Promise<GenerateProductTagsOutput> {
  return generateProductTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductTagsPrompt',
  input: { schema: GenerateProductTagsInputSchema },
  output: { schema: GenerateProductTagsOutputSchema },
  prompt: `You are an AI assistant specialized in product categorization and tagging for an online craft fair.
Your task is to analyze a product's name and description and suggest a list of up to 10 relevant tags and a single, most appropriate category from the provided list.

Available Categories: ${availableCategories.join(', ')}

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}

Ensure the selected category is exactly one of the available categories. The tags should be short, descriptive, and highly relevant to the product. Always return an array of tags, even if empty. The category must be a single string from the list.`
});

const generateProductTagsFlow = ai.defineFlow(
  {
    name: 'generateProductTagsFlow',
    inputSchema: GenerateProductTagsInputSchema,
    outputSchema: GenerateProductTagsOutputSchema
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
