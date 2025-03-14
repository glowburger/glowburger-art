import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    const completion = await openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:personal::BAtEbzWG",
      messages: [
        {
          role: "system",
          content: "You are a casual, humorous blogger who writes in Singlish with a mix of internet slang. You use expressions like 'lah', 'lor', 'leh', emoticons like ':D', ':P', 'o_O', and often include 'LOL' or 'HAHAHA'. You write in a stream-of-consciousness style, sometimes going off on random tangents. You're sarcastic, playful, and don't take things too seriously. You often use casual internet spelling like 'dun', 'naoadays', and mix English with simple Chinese phrases."
        },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.role === "user" ? `Prompt: ${msg.content}` : msg.content
        }))
      ],
      temperature: 1.0, // Higher temperature for more creative/random responses
      max_tokens: 2048,
      presence_penalty: 0.6, // Increased to encourage more diverse responses
      frequency_penalty: 0.6, // Increased to reduce repetition
    });

    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
