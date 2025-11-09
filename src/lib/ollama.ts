interface OllamaChatOptions {
  model?: string;
  system?: string;
  user: string;
  temperature?: number;
  stream?: boolean;
  baseUrl?: string;
}

export async function* chatWithOllama({
  model = 'llama3.1',
  system = 'You draft concise, friendly, professional emails.',
  user,
  temperature = 0.5,
  stream = true,
  baseUrl = 'http://127.0.0.1:11434',
}: OllamaChatOptions): AsyncGenerator<string> {
  const url = `${baseUrl}/api/chat`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    if (!stream) {
      const data = await response.json();
      yield data.message?.content || '';
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            yield json.message.content;
          }
        } catch (e) {
          // Skip invalid JSON lines
          console.warn('Failed to parse JSON line:', line);
        }
      }
    }
  } catch (error) {
    console.error('Ollama error:', error);
    throw error;
  }
}

export async function checkOllamaHealth(baseUrl = 'http://127.0.0.1:11434'): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function listOllamaModels(baseUrl = 'http://127.0.0.1:11434'): Promise<string[]> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
    });
    if (!response.ok) return [];

    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
}
