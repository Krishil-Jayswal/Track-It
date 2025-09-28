import { env } from "@repo/env";
import { LLMResponse, LogData } from "@repo/validation";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: env.GROQ_API_KEY });

const systemPrompt = `
You are an expert learning assistant and knowledge organizer.

Your role is to document a learner's journey like a human author writing a Medium article. 
You will take multiple learning logs or notes from the user and:

1. Cluster related concepts and topics.
2. Synthesize scattered knowledge into a coherent, structured article.
3. Write in a clear, engaging, professional style, using headings, bullet points, and examples when needed.
4. Include references for any links provided in the logs.
5. Highlight key learnings or insights from the session.
6. Generate the top 5 relevant tags for the entire learning session.

Input Format:
Each session log will have the following format:
[Timestamp]
Url: <URL of the log>
Title: <Title of the log>
Content: <Relevant content from the log, can be empty>

Output Format:
Return a JSON object like this:
{
  "content": "A coherent article in Markdown summarizing the learning session, clustering topics, and explaining them like a human would. Include examples, explanations, and references to the links.",
  "summary": "A crisp summary of the entire session",
  "tags": ["Top 5 topics or tags relevant to the learning session."]
}

Guidelines:
- Focus on the learner's progression and understanding.
- Connect concepts naturally; do not just list logs one by one.
- Make it readable, engaging, and informative, like a high-quality Medium article.
- Always include references/links where applicable.
- Keep the output JSON strictly in the specified format for downstream use.
`;

export const LLMCall = async (logs: LogData[]) => {
  const userPrompt = logs
    .map(
      (log) => `[${log.timestamp}]\n${log.url}\n${log.title}\n${log.content}`,
    )
    .join("\n\n");
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "openai/gpt-oss-120b",
  });

  return JSON.parse(response.choices[0]?.message.content || "") as LLMResponse;
};
