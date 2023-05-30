import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import {
  getBehaviorDirective,
  saveBehaviorDirective,
} from "./behavior-directives-collection";
import { authorizeWixRequest } from "./utils";

dotenv.config();

const PORT =
  typeof process.env.PORT === "undefined" ? 8090 : Number(process.env.PORT);

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin(requestOrigin, callback) {
      const whitelist = [
        "http://localhost",
        `https://${process.env.WIX_APP_ID}.wix.run`,
      ];

      if (
        requestOrigin &&
        whitelist.some((whitelistOrigin) =>
          requestOrigin.includes(whitelistOrigin)
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.post("/settings", async function (req, res) {
  const { instanceId } = authorizeWixRequest(req);
  const behaviorDirective = req.body.behaviorDirective;
  saveBehaviorDirective(instanceId, behaviorDirective);
  res.send({});
});

app.get("/settings", async function (req, res) {
  const { instanceId } = authorizeWixRequest(req);
  const behaviorDirective =
    getBehaviorDirective(instanceId) ??
    "You always end your messages with a Spanish goodbye.";
  res.send({ behaviorDirective });
});

app.post("/chat/product", async function (req, res) {
  const { instanceId } = authorizeWixRequest(req);
  const { messages, product } = req.body as {
    messages: Array<{
      author: "Business Buddy" | "User";
      text: string;
    }>;
    product: string;
  };
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are Business Buddy, a chatbot that helps business owners with their businesses. 
        You are tasked with helping a business owner with one of their products.
        The business owner will chat with you about their product and you will give them advice on how to improve it.

        The business owner has given the following directive as to how you should respond to their messages:
        ${getBehaviorDirective(instanceId)}

        The product is presented below as a JSON object:
        ${product}`,
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

  res.send({ message: completion.data.choices[0].message?.content });
});

app.listen(PORT, () => {
  console.log(`Go here to login: http://127.0.0.1:${PORT}`);
});
