const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const getFinancialAdvice = async (expenses, debts) => {
  // 1. Prepare a summary of the user's data for the AI
  const expenseSummary = expenses.map(e => `- ${e.category}: €${e.amount} (${e.note || 'no note'})`).join('\n');
  const debtSummary = debts.filter(d => !d.settled).map(d => `- Owes €${d.amount} to ${d.person}`).join('\n');

  // 2. Craft the prompt
  const prompt = `
    You are a professional financial advisor. Here is my spending for the month:
    ${expenseSummary}

    Here are my current active debts:
    ${debtSummary}

    Based on this data, provide 3 short, actionable, and encouraging pieces of advice to help me save money or manage my debts better. 
    Keep the response under 100 words and use a friendly tone.
  `;

  // 3. Call the API
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble crunching the numbers right now. Try again in a minute!";
  }
};