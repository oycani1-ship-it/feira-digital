'use server';
/**
 * @fileOverview A Genkit flow for generating compelling and detailed product descriptions for sellers.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
  shortDescription: z.string().describe('A brief, catchy description of the product.'),
  tags: z.array(z.string()).describe('Keywords or tags associated with the product.').optional(),
  userPrompt: z.string().describe('Additional instructions or a specific tone requested by the user for the description.').optional(),
  imageUrls: z.array(
    z.string().describe(
      "A product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
  ).optional().describe('Optional array of product image data URIs for context.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated detailed product description in Brazilian Portuguese.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Você é um copywriter de marketing especialista para a "Feira Digital", um marketplace online de feiras de artesanato. Sua tarefa é criar uma descrição de produto envolvente e detalhada em Português do Brasil, que seja atraente para potenciais compradores.

Utilize as seguintes informações para elaborar a descrição:

Nome do Produto: {{{productName}}}
Categoria: {{{category}}}
Breve Descrição: {{{shortDescription}}}
{{#if tags}}
Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

{{#if userPrompt}}
Instruções adicionais do usuário: {{{userPrompt}}}
{{/if}}

{{#if imageUrls}}
Considere estas imagens do produto para inspiração e contexto:
{{#each imageUrls}}
  {{media url=this}}
{{/each}}
{{/if}}

Por favor, escreva uma descrição de produto detalhada e cativante que destaque suas qualidades únicas, o artesanato e os benefícios para o cliente. Certifique-se de que o tom seja acolhedor, autêntico e convidativo, adequado para um produto feito à mão. A descrição deve ter entre 150 e 300 palavras.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await productDescriptionPrompt(input);
    return output!;
  }
);
