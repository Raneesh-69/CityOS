import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);

const { analyzeComplaint } = await import("./services/aiService.js");

const result = await analyzeComplaint(
  "There is a huge pothole near the bus stand causing accidents.",
);

console.log(result);
