const { generateCompletion } = require('../utils/openrouter');

const searchProjects = async (req, res) => {
    try {
        const { query, projects } = req.body;

        if (!query || !projects || !Array.isArray(projects)) {
            return res.status(400).json({ error: 'Missing query or projects array' });
        }

        if (projects.length === 0) {
            return res.json({ matchingIds: [] });
        }

        // Format projects for the prompt
        const projectList = projects
            .map((p, i) => `Project ${i + 1} (ID: ${p.id}):\nTitle: ${p.title}\nDescription: ${p.description}`)
            .join('\n\n');

        const prompt = `You are a project search assistant. An investor is looking for projects matching this query: "${query}"

Here are the available projects:

${projectList}

Return ONLY a JSON array of project IDs that match the search query. Consider semantic meaning, not just keyword matching. If no projects match, return an empty array.

Example response: ["id1", "id2"]

Your response (JSON array only):`;

        const messages = [{ role: 'user', content: prompt }];
        const text = await generateCompletion(messages);

        // Parse JSON response
        let matchingIds = [];
        try {
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                matchingIds = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            matchingIds = [];
        }

        res.json({ matchingIds });
    } catch (error) {
        console.error('AI Search error:', error);
        res.status(500).json({ error: 'AI search failed' });
    }
};

const chatWithAI = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // System instruction
        const systemInstruction = {
            role: 'system',
            content: `You are the AI Assistant for AfterHack.
            Role: Help students with projects and founders/recruiters with discovery.
            Tone: Friendly, professional, concise.
            Context: Users can search projects via dashboard.`
        };

        // Convert frontend messages to OpenAI format
        const conversation = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const finalMessages = [systemInstruction, ...conversation];

        const text = await generateCompletion(finalMessages);

        res.json({ text });
    } catch (error) {
        console.error('AI Chat Error:', error);
        const status = error.status || 500;
        // OpenRouter might return 429 too, so we keep the message
        const message = error.message.includes('429') ? 'Too many requests. Please wait a moment.' : 'Failed to generate chat response';
        res.status(status).json({ error: message });
    }
};

module.exports = { searchProjects, chatWithAI };
