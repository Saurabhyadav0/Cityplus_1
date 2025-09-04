import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // put in your .env
})

export async function generatePriorityScore(
  title: string,
  description: string,
  photoUrl?: string
): Promise<number> {
  const prompt = `
You are a civic issue prioritization model.
Based on the following complaint details, assign a priority score from 1 (least urgent) to 10 (most urgent).

Complaint:
- Title: ${title}
- Description: ${description}
- Image URL: ${photoUrl ?? "No image"}

Rules:
- Garbage blocking road, major potholes, broken streetlights on highways, or water leakage = higher score (7-10).
- Small issues like minor litter, small potholes, or cosmetic issues = lower score (1-5).
- Always return ONLY a single integer between 1 and 10.
`

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // fast + free tier
    messages: [{ role: "user", content: prompt }],
  })

  const text = response.choices[0]?.message?.content?.trim() || "5"
  const score = parseInt(text.match(/\d+/)?.[0] || "5", 10)

  console.log("✅ Parsed priority score (Groq):", score)

  return Math.min(10, Math.max(1, score)) // clamp 1–10
}
