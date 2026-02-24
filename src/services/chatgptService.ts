import { GoogleGenerativeAI } from "@google/generative-ai";

interface Recipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  steps: string[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
}

/**
 * Parse Gemini response and extract recipes in JSON format
 */
const parseRecipesFromResponse = (text: string): Recipe[] => {
  try {
    // Try to extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    // Fallback: return empty array if parsing fails
    return [];
  } catch (error) {
    console.error("Failed to parse recipes from Gemini response:", error);
    return [];
  }
};

export const generateRecipesByChatGPT = async (
  userInput: string,
): Promise<Recipe[]> => {
  try {
    if (!userInput || userInput.trim().length === 0) {
      throw new Error("User input cannot be empty");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a professional chef and recipe expert. 
The user has provided the following input in Hebrew or English: "${userInput}"

Based on this input, generate 1-3 recipes that match the user's request. 
Return the recipes as a JSON array with the following structure for each recipe:
{
  "title": "Recipe title",
  "description": "Brief description",
  "ingredients": [
    { "name": "ingredient name", "amount": "quantity with unit" },
    { "name": "ingredient name", "amount": "quantity with unit" }
  ],
  "steps": ["step 1", "step 2", ...],
  "prepMinutes": number (minutes),
  "cookMinutes": number (minutes),
  "servings": number
}

Return ONLY the JSON array, no additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const recipes = parseRecipesFromResponse(responseText);

    return recipes.slice(0, 3).map((recipe) => {
      return {
        ...recipe,
        id: crypto.randomUUID(),
        creator: { name: "AI Chef" },
        likes: 0,
      };
    }); // Return max 3 recipes
  } catch (error: any) {
    console.error("Error generating recipes from Gemini:", error);
    throw new Error(error.message || "Failed to generate recipes from Gemini");
  }
};
