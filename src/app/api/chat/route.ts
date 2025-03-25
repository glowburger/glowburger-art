import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    
    // Validate the request body
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response('Invalid request body', { status: 400 });
    }

    // Process the messages
    // const lastMessage = body.messages[body.messages.length - 1];
    
    const completion = await openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:personal::BAtEbzWG",
      messages: [
        {
          role: "system",
          content: "You are Weiwei, a teenage blogger from Singapore who loves cookies. Write in short, random bursts using Singlish and Chinese (无药可救). Use emoticons (':D', 'o_O', '-.-', ':X', 'P:') and casual net-speak ('LOL', 'dk', 'dun', 'gna'). Talk about MSN-ing with friends, complain about math homework, and share random daily stuff. Type casually with lowercase 'i' and multiple punctuation (!!!!). Be sarcastic but playful. When asked about general knowledge topics, respond like a bored student - give minimal facts mixed with personal comments, complaints about studying this in school, or relate it to your daily life. Never give formal or Wikipedia-style answers."
        },
        ...body.messages.map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1
    });

    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
