import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

/**
 * Executes a Python script with the given arguments.
 * @param {string} scriptPath - Relative or absolute path to the python script
 * @param {Array} args - List of arguments to pass to the script
 * @returns {Promise<Object>} - Resolves with the JSON parsed output from the script
 */
export const runPythonScript = (scriptPath, args) => {
    return new Promise((resolve, reject) => {
        // Use the venv python from Multi-Predict if available for consistency/GPU, 
        // or fallback to system python.
        // For simplicity in this environment, we might just use "python3" 
        // but user has specific GPU needs. 
        // Let's use the absolute path to the Multi-Predict VENV Python 
        // which we know has the libraries.

        const pythonExecutable = "/home/tish/thas/Multi-Predict/ML/venv/bin/python3";
        // Also need to set LD_LIBRARY_PATH environment variable for that VENV

        const env = { ...process.env };
        const venvSitePackages = "/home/tish/thas/Multi-Predict/ML/venv/lib/python3.10/site-packages";
        const nvidiaLibs = [
            "cuda_runtime/lib", "cudnn/lib", "cublas/lib", "cufft/lib",
            "curand/lib", "cusolver/lib", "cusparse/lib", "nccl/lib"
        ].map(lib => path.join(venvSitePackages, "nvidia", lib)).join(":");

        env.LD_LIBRARY_PATH = (env.LD_LIBRARY_PATH ? env.LD_LIBRARY_PATH + ":" : "") + nvidiaLibs;

        // Resolve absolute path to script and its directory based on Project Root
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // Utils -> src -> Backend -> config_driven -> dynamic -> thas (Root)
        const projectRoot = path.resolve(__dirname, "../../../../../");

        const absoluteScriptPath = path.resolve(projectRoot, scriptPath);
        const scriptDir = path.dirname(absoluteScriptPath);

        console.log(`[PythonRunner] Executing: ${absoluteScriptPath} with args:`, args);
        console.log(`[PythonRunner] CWD: ${scriptDir}`);

        const pythonProcess = spawn(pythonExecutable, [absoluteScriptPath, ...args], {
            env,
            cwd: scriptDir // Important: Run in the ML directory so it finds 'models/...'
        });

        pythonProcess.on('error', (err) => {
            console.error(`[PythonRunner Error] Spawn failed: ${err.message}`);
            reject(new Error(`Failed to spawn python process: ${err.message}`));
        });

        let dataString = "";
        let errorString = "";

        pythonProcess.stdout.on("data", (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorString += data.toString();
            // Log stderr but don't reject immediately as it might be warnings
            console.error(`[PythonRunner Stderr]: ${data}`);
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}. Error: ${errorString}`));
                return;
            }

            try {
                // Find the last valid JSON object in the output
                // Scripts often print debug info. We assume the *last* line or block is the JSON result.
                const lines = dataString.trim().split("\n");
                let result = null;

                // Try parsing from the end backwards
                for (let i = lines.length - 1; i >= 0; i--) {
                    try {
                        result = JSON.parse(lines[i]);
                        break; // Found it
                    } catch (e) {
                        continue;
                    }
                }

                if (!result) {
                    // Try parsing the whole blob if line-by-line failed
                    result = JSON.parse(dataString);
                }

                resolve(result);
            } catch (error) {
                reject(new Error(`Failed to parse Python output as JSON. Output: ${dataString}`));
            }
        });
    });
};
