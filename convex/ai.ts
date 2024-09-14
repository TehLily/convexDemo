import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY!;

export const chat = action({
    args: {
        messageBody: v.string(),
    },
    handler: async (ctx, args) => {
        const response = await fetch(
            "https://api.together.xyz/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${TOGETHER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/Llama-3-8b-chat-hf",
                    messages: [
                        {
                            role: "system",
                            content:
                            "You are a terse boy in a group chat responding to questions with 1-sentence answers.",
                        },
                        {
                            role: "user",
                            content: args.messageBody,
                        },
                    ],
                }),
            }
        );

        const json = await response.json();
        const messageContent = json.choices[0].message?.content;

        await ctx.runMutation(api.messages.send, {
            author: "AI Agent",
            body: messageContent || "Sorry, I don't have an answer for that.",
        })
    },
});