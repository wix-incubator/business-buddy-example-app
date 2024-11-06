import { appInstances } from "@wix/app-management";
import { getBehaviorDirective } from "../../database";
import OpenAI from "openai";

interface ChatMessage {
  author: "Business Buddy" | "User";
  text: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  product: string;
}

export async function POST(req: Request) {
  try {
    const { instance } = await appInstances.getAppInstance();
    const { messages, product } = (await req.json()) as ChatRequestBody;

    if (!instance?.instanceId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const openai = new OpenAI({
      apiKey: "", // You can store your OpenAi API key here
    });

    const behaviorDirective = await getBehaviorDirective(instance.instanceId);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are Business Buddy, a chatbot that helps business owners with their businesses. 
            You are tasked with helping a business owner with one of their products.
            The business owner will chat with you about their product and you will give them advice on how to improve it.

            The business owner has given the following directive as to how you should respond to their messages:

            ${behaviorDirective}

            The product is presented below as a JSON object: ${product}
          `,
        },
        ...messages.map((message) => ({
          role:
            message.author === "Business Buddy"
              ? ("assistant" as const)
              : ("user" as const),
          content: message.text,
        })),
      ],
      max_tokens: 2000,
      n: 1,
    });

    return Response.json({ message: completion.choices[0].message?.content });
  } catch (error) {
    console.error(`Error getting settings for an instance`, error);
    return Response.error();
  }
}
