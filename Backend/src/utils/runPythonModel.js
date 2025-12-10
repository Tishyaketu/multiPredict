import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to ML directory relative to this file
// src/utils/runPythonModel.js -> ../../ML
const ML_DIR = path.resolve(__dirname, "../../../ML");
const PYTHON_PATH = path.join(ML_DIR, "venv", "bin", "python");

/**
 * Runs a Python script with given arguments using child_process.spawn
 * @param {string} scriptName - Name of the script in ML directory (e.g. 'predict_heart.py')
 * @param {Array} args - Array of command line arguments
 * @returns {Promise<Object>} - Resolves with JSON parsed output from Python
 */
export const runPythonModel = (scriptName, args = []) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(ML_DIR, scriptName);

        // Spawn Python process with CWD set to ML_DIR so it can find 'models/'
        const pythonProcess = spawn(PYTHON_PATH, [scriptPath, ...args], { cwd: ML_DIR });

        let dataString = "";
        let errorString = "";

        // Collect data from stdout
        pythonProcess.stdout.on("data", (data) => {
            dataString += data.toString();
        });

        // Collect errors from stderr
        pythonProcess.stderr.on("data", (data) => {
            errorString += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                // If exit code is not 0, reject with stderr
                reject(new Error(`Python script exited with code ${code}. Error: ${errorString}`));
            } else {
                try {
                    // Try to parse the last line as JSON (in case there are logs before it)
                    // We split by newline and take the last non-empty line
                    const lines = dataString.trim().split('\n');
                    const lastLine = lines[lines.length - 1];
                    const jsonResult = JSON.parse(lastLine);
                    resolve(jsonResult);
                } catch (parseError) {
                    console.error("Failed JSON parse. Raw output:", dataString);
                    reject(new Error(`Failed to parse Python output: ${parseError.message}`));
                }
            }
        });
    });
};
