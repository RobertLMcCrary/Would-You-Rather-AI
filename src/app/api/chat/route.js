import { HfInference } from '@huggingface/inference';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req) {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return new Response(
            JSON.stringify({
                error: 'Invalid request body. Provide an array of messages.',
            }),
            { status: 400 }
        );
    }

    const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

    try {
        let out = '';
        const stream = await client.chatCompletionStream({
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            messages,
            max_tokens: 500,
            temperature: 0.9, // Increased randomness for more variety
        });

        for await (const chunk of stream) {
            if (chunk.choices && chunk.choices.length > 0) {
                const newContent = chunk.choices[0].delta.content;
                out += newContent;
            }
        }

        return new Response(JSON.stringify({ output: out }), {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error during Qwen API call:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process the request' }),
            { status: 500 }
        );
    }
}
