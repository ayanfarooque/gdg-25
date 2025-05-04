const { spawn } = require('child_process');
const path = require('path');

class GeminiService {
    static async processQuestion(question) {
        try {
            const pythonProcess = spawn('python', [
                path.join(__dirname, '../../ai/rag/app.py'),
                '--question', question
            ]);

            return new Promise((resolve, reject) => {
                let result = '';
                let error = '';

                pythonProcess.stdout.on('data', (data) => {
                    result += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    error += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Python process exited with code ${code}: ${error}`));
                    } else {
                        resolve(result.trim());
                    }
                });
            });
        } catch (error) {
            console.error('Error in GeminiService:', error);
            throw error;
        }
    }
}

module.exports = GeminiService;