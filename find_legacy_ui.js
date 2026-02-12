const fs = require('fs');

try {
    const content = fs.readFileSync('c:/Users/mkysi/ReaderApp/app/index.js', 'utf8');
    const lines = content.split('\n');

    console.log("Searching for appMode usage...");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('appMode ===')) {
            console.log(`${i + 1}: ${line.trim().substring(0, 150)}`);
        }
    }
} catch (e) {
    console.error("Error reading file:", e);
}
