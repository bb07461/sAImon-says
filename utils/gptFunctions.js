import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write back between 12 to 18 messages within quotes. in 70 percent of them Say simon says in the beginning, then any one of these commands: press the left button, press the right button, flick stick up, flick stick down, flick stick right, flick stick left",
        },
    ],
});

console.log(completion.choices[0].message);