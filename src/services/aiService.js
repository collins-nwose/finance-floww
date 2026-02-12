// client/src/services/aiService.js

export const getFinancialAdvice = async (expenses, debts) => {
  try {
    // We now fetch from OUR server, which then calls Claude
    const response = await fetch("http://127.0.0.1:3001/api/coach", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ expenses, debts })
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    
    // We return the 'advice' field that we defined in server.js
    return data.advice;
  } catch (error) {
    console.error("Connection Error:", error);
    return "I'm having trouble connecting to the coach. Make sure your server is running!";
  }
};