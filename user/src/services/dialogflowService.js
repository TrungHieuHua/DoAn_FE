const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Khởi tạo session client
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const detectIntent = async (text, sessionId) => {
    try {
        const sessionPath = sessionClient.projectAgentSessionPath(
            projectId,
            sessionId
        );

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'vi-VN',
                },
            },
        };

        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;

        return {
            text: result.fulfillmentText,
            intent: result.intent.displayName,
            parameters: result.parameters.fields,
        };
    } catch (error) {
        console.error('Error detecting intent:', error);
        throw error;
    }
};

module.exports = {
    detectIntent,
}; 