export async function chatWithSensei(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });

  if (!response.ok) {
    throw new Error('Falha na comunicação com o treinador IA.');
  }

  const data = await response.json();
  return data.text;
}
