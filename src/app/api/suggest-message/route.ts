import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    try {
        const result = await streamText({
            model: openai('gpt-3.5'),
            messages: convertToCoreMessages(messages),
        });

        return Response.json({
            success: true,
            data: result.toDataStreamResponse(),
            message: "Successfully suggest message generated"
        }, {
            status: 200
        });

    } catch (error) {
        console.log("Error occurred: ", error);
        return Response.json({
            success: false,
            message: "Error occured while generating suggest message",
            statusCode: 500
        }, {
            status: 500
        })
    }
}