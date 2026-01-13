import OpenAI from 'openai';
import { ContentType } from '../types';
import { logger } from '../utils/logger';

const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
};

export class AIService {
  /**
   * Generate content based on prompt and content type
   */
  static async generateContent(
    prompt: string,
    contentType: ContentType
  ): Promise<string> {
    try {
      const openai = getOpenAIClient();
      const systemPrompt = this.getSystemPrompt(contentType);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const generatedText = completion.choices[0]?.message?.content || '';
      
      if (!generatedText) {
        throw new Error('No content generated from OpenAI');
      }

      logger.info(`Content generated successfully for type: ${contentType}`);
      return generatedText;
    } catch (error: any) {
      logger.error('OpenAI API error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Get system prompt based on content type
   */
  private static getSystemPrompt(contentType: ContentType): string {
    const prompts = {
      blog: 'You are an expert blog writer. Write engaging, informative, and well-structured blog posts. Use clear headings, proper formatting, and maintain a professional yet accessible tone.',
      product: 'You are a professional product description writer. Write compelling, detailed product descriptions that highlight features, benefits, and appeal to potential customers. Be persuasive but honest.',
      caption: 'You are a creative social media content writer. Write engaging, concise captions that are perfect for social media posts. Include relevant hashtags when appropriate and maintain an authentic voice.',
    };

    return prompts[contentType] || prompts.blog;
  }

  /**
   * Generate a title from the generated content
   */
  static async generateTitle(content: string): Promise<string> {
    try {
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a title generator. Generate a concise, engaging title (maximum 10 words) based on the provided content.',
          },
          {
            role: 'user',
            content: `Generate a title for this content:\n\n${content.substring(0, 500)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 50,
      });

      const title = completion.choices[0]?.message?.content?.trim() || 'Generated Content';
      return title.replace(/^["']|["']$/g, ''); // Remove quotes if present
    } catch (error: any) {
      logger.error('Title generation error:', error);
      return 'Generated Content';
    }
  }
}

