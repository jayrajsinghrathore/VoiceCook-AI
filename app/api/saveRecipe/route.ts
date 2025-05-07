import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';



// Initialize Prisma Client (with global caching for Next.js)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/**
 * POST /api/saveRecipe
 * Saves a recipe to the database by fetching details from the Spoonacular API.
 * Expects a JSON body with { recipeId: number }.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();
    const { recipeId } = body;

    // Validate recipeId
    if (!recipeId || typeof recipeId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid or missing recipeId' },
        { status: 400 }
      );
    }

    const userId = 'user123'; // Mock user ID

    // Check if recipe already exists for this user
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        spoonacularId: recipeId,
        userId: userId,
      },
    });

    if (existingRecipe) {
      // Return existing recipe
      return NextResponse.json(existingRecipe, { status: 200 });
    }

    // Fetch recipe details from Spoonacular API
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Spoonacular API key not configured' },
        { status: 500 }
      );
    }

    const spoonacularUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(spoonacularUrl);

    if (!response.ok) {
      // If fetch fails, return error details
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        {
          error: 'Failed to fetch recipe from Spoonacular API',
          details: errorData,
        },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();

    // Extract relevant fields from Spoonacular response
    const {
      title,
      image,
      readyInMinutes,
      servings,
      summary,
      instructions,
      diets,
      extendedIngredients,
    } = data;

    // Prepare data for saving
    const recipeData = {
      spoonacularId: recipeId,
      title: title || '',
      image: image || '',
      readyInMinutes: readyInMinutes || 0,
      servings: servings || 0,
      summary: summary || '',
      instructions: instructions || '',
      diets: Array.isArray(diets) ? diets : [],
      ingredients: Array.isArray(extendedIngredients)
        ? extendedIngredients.map((ing: any) => ing.original || ing.name || '')
        : [],
      userId: userId,
    };

    // Save to database
    const savedRecipe = await prisma.recipe.create({
      data: recipeData,
    });

    return NextResponse.json(savedRecipe, { status: 201 });
  } catch (error: any) {
    console.error('Error in /api/saveRecipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
