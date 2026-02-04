import Groq from "groq-sdk";
import { Week } from '../types';

export const generateSummary = async (week: Week): Promise<string> => {
  // 1. Prepare the activity logs from the object-based structure
  const activities = week.days
    .filter(day => Object.values(day.log).some(val => val.trim() !== ''))
    .map(day => {
        const dateString = `- ${new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}:`;
        const logEntries = Object.entries(day.log)
            .filter(([_, value]) => value.trim() !== '')
            .map(([key, value]) => `  - ${key}: ${value}`)
            .join('\n');
        return `${dateString}\n${logEntries}`;
    }).join('\n\n');

  if (!activities) {
    return "No activities were logged for this week, so a summary could not be generated.";
  }

  // 2. Setup the Groq client
  // Note: Groq typically uses GROQ_API_KEY as the env variable name
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Groq API key not set. Please configure GROQ_API_KEY in your environment.');
  }

  const groq = new Groq({ 
    apiKey,
    dangerouslyAllowBrowser: true // Required if calling directly from the frontend
  });

  const prompt = `Based on the following structured daily logs for an intern, please generate a concise weekly summary in a single paragraph. Highlight key achievements, skills learned, and any challenges faced. Present it in a professional tone.\n\nDaily Logs:\n${activities}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // llama-3.3-70b-versatile is excellent for summaries
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 500,
    });

    const generatedSummary = chatCompletion.choices[0]?.message?.content;

    if (generatedSummary) {
      return generatedSummary.trim();
    } else {
      throw new Error('The model returned an empty response.');
    }
  } catch (error: any) {
    console.error("Groq API error:", error);

    // Specific error handling for Groq status codes
    if (error?.status === 401) {
      throw new Error('Your Groq API key is invalid. Please check your configuration.');
    }
    if (error?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }

    throw new Error('An error occurred while communicating with the AI. Please try again later.');
  }
};