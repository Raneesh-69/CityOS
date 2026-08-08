import Groq from "groq-sdk";

export const analyzeComplaint = async (description) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are the AI engine for CityOS.

Your job is to analyze a citizen complaint.

Return ONLY valid JSON.

Do NOT write explanations.
Do NOT add markdown.
Do NOT invent new categories or departments.

Choose ONLY one value from each list.

Categories:
- Road Damage
- Garbage
- Water Leakage
- Street Light
- Drainage
- Electricity
- Traffic
- Public Property Damage
- Other

Departments:
- Roads Department
- Sanitation Department
- Water Department
- Electricity Department
- Drainage Department
- Traffic Police
- Municipal Department

Priority Rules:
- High → danger, accident, electricity, water leakage, major road damage
- Medium → garbage, drainage blockage, broken public property
- Low → suggestions, minor issues

Return EXACTLY this JSON:

{
  "category": "",
  "department": "",
  "priority": "",
  "summary": ""
}
`,
      },
      {
        role: "user",
        content: description,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};
