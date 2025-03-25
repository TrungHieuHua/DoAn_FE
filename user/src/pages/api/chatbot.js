import { detectIntent } from '../../services/dialogflowService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ message: 'Message and sessionId are required' });
        }

        const response = await detectIntent(message, sessionId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in chatbot API:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 