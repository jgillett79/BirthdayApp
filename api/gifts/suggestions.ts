import { Response } from 'express';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { GiftSuggestionRequest, GiftSuggestion, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }

  try {
    const request = req.body as GiftSuggestionRequest;

    if (!request.personName) {
      return res.status(400).json({
        success: false,
        error: 'Person name is required',
      } as ApiResponse);
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return fallback suggestions if no API key is configured
      const suggestions = getFallbackSuggestions(request);
      return res.status(200).json({
        success: true,
        data: suggestions,
      } as ApiResponse<GiftSuggestion[]>);
    }

    // Use AI to generate suggestions
    const suggestions = await generateAISuggestions(request, apiKey);

    return res.status(200).json({
      success: true,
      data: suggestions,
    } as ApiResponse<GiftSuggestion[]>);
  } catch (error) {
    console.error('Gift suggestion error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

function getFallbackSuggestions(request: GiftSuggestionRequest): GiftSuggestion[] {
  const { age, relationship, priceRange } = request;
  const maxPrice = priceRange?.max || 50;

  const suggestions: GiftSuggestion[] = [];

  if (age && age < 5) {
    suggestions.push({
      idea: 'Educational Toys',
      description: 'Age-appropriate building blocks, puzzles, or interactive learning toys',
      estimatedPrice: Math.min(25, maxPrice),
      reasoning: 'Great for developing motor skills and cognitive abilities at this age',
    });
  } else if (age && age < 13) {
    suggestions.push({
      idea: 'Board Games or Books',
      description: 'Popular board games or age-appropriate book series',
      estimatedPrice: Math.min(30, maxPrice),
      reasoning: 'Encourages reading, strategic thinking, and family time',
    });
  } else if (age && age < 18) {
    suggestions.push({
      idea: 'Gift Cards or Tech Accessories',
      description: 'Gift cards to favorite stores or phone/gaming accessories',
      estimatedPrice: Math.min(40, maxPrice),
      reasoning: 'Teens appreciate the freedom to choose their own items',
    });
  } else {
    suggestions.push({
      idea: 'Personalized Gift',
      description: 'Custom photo album, engraved item, or handmade craft',
      estimatedPrice: Math.min(35, maxPrice),
      reasoning: 'Thoughtful and meaningful for adult relationships',
    });
  }

  suggestions.push({
    idea: 'Experience Gift',
    description: 'Tickets to a movie, museum, concert, or activity',
    estimatedPrice: Math.min(45, maxPrice),
    reasoning: 'Creates lasting memories rather than material possessions',
  });

  suggestions.push({
    idea: 'Practical Gift',
    description: 'Quality everyday items like water bottles, bags, or organizers',
    estimatedPrice: Math.min(30, maxPrice),
    reasoning: 'Useful items that improve daily life',
  });

  return suggestions.slice(0, 5);
}

async function generateAISuggestions(
  request: GiftSuggestionRequest,
  apiKey: string
): Promise<GiftSuggestion[]> {
  // This is a placeholder for AI integration
  // You would integrate with OpenAI or Anthropic API here
  // For now, return fallback suggestions

  const { personName, age, interests, relationship, priceRange } = request;

  const prompt = `Generate 5 thoughtful gift suggestions for ${personName}
${age ? `Age: ${age}` : ''}
${relationship ? `Relationship: ${relationship}` : ''}
${interests && interests.length > 0 ? `Interests: ${interests.join(', ')}` : ''}
${priceRange ? `Budget: $${priceRange.min}-$${priceRange.max}` : ''}

For each suggestion, provide:
1. Gift idea name
2. Brief description
3. Estimated price
4. Reasoning for the suggestion`;

  // TODO: Implement actual AI API call here
  // For now, return fallback suggestions
  return getFallbackSuggestions(request);
}

export default cors(authenticate(handler));
