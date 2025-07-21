import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Add this helper function to handle the response safely
async function getGeneratedContent(model: any, prompt: string) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error in generating content:', error);
        throw new Error('Failed to generate content. Please check your API key and try again.');
    }
}

export async function POST(request: Request) {
    try {
        console.log('Request received at:', new Date().toISOString());
        const body = await request.json();
        console.log('Request body:', JSON.stringify(body, null, 2));
        
        const { title, subtitle, category } = body;

        // Validate required fields
        if (!title || !category) {
            const error = 'Title and category are required';
            console.error('Validation error:', error);
            return NextResponse.json(
                { error },
                { status: 400 }
            );
        }

        // Validate API key
        console.log('Checking for GEMINI_API_KEY...');
        if (!process.env.GEMINI_API_KEY) {
            const error = 'GEMINI_API_KEY is not set in environment variables';
            console.error('Configuration error:', error);
            return NextResponse.json(
                { error: 'Server configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        try {
            // Get the generative model
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Create a prompt for the AI
            const prompt = `Write a detailed, engaging blog post with the following details:
            Title: ${title} 
            ${subtitle ? `Subtitle: ${subtitle}\n` : ''}
            Category: ${category}

            Requirements:
            - Write in a professional yet conversational tone
            - Include relevant headings and subheadings
            - Use markdown formatting (## for headings, **bold** for emphasis, etc.)
            - Minimum 500 words
            - Include relevant examples and practical tips
            - End with a conclusion and call-to-action`;

            console.log('Sending request to Gemini API...');
            // Generate content with timeout
            const content = await Promise.race([
                getGeneratedContent(model, prompt),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timed out. Please try again.')), 30000)
                )
            ]);

            console.log('Successfully received content from Gemini API');
            return NextResponse.json({ content });

        } catch (apiError) {
            console.error('API Error:', apiError);
            return NextResponse.json(
                { error: apiError instanceof Error ? apiError.message : 'Failed to generate content' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}