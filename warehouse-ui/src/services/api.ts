const API_URL = "http://127.0.0.1:8000";

export async function askQuestion(question: string) {
  const response = await fetch(
    `${API_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  return response.json();
}