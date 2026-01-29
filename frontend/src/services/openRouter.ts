
export interface AISearchResponse {
    answer: string;
    error?: string;
}

const SYSTEM_PROMPT = `You are an AI assistant for AfterHack, a cybersecurity learning platform. 
Help users find information about:
- Cybersecurity courses and tutorials
- Ethical hacking techniques
- Security tools and resources
- Learning paths for beginners to advanced
- CTF challenges and practice
- Certification guidance

Provide concise, accurate answers (under 200 characters for search results).
If the query is about course content, link to relevant sections using markdown or clear text.
Always prioritize security best practices and ethical approaches.
Do not provide malicious code.`;

export async function searchWithAI(query: string): Promise<AISearchResponse> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
        console.warn('OpenRouter API key is missing');
        return { answer: '', error: 'AI Search configuration missing.' };
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://afterhack.com', // Update with actual domain
                'X-Title': 'AfterHack - Cybersecurity Learning Platform',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet', // Using the requested model
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: 'user',
                        content: query,
                    },
                ],
                max_tokens: 250,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            if (response.status === 429) {
                return { answer: '', error: 'Too many requests. Please try again later.' };
            }
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 'No answer found.';

        return { answer: content };

    } catch (error) {
        console.error('AI Search Error:', error);
        return { answer: '', error: 'Failed to get AI response. Try again.' };
    }
}
