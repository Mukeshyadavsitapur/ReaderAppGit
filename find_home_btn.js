const fs = require('fs');
try {
    const content = fs.readFileSync('c:/Users/mkysi/ReaderApp/app/index.js', 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const index = i + 1;
        const line = lines[i];
        if (line.toLowerCase().includes('how to use') || line.toLowerCase().includes('tutorial')) {
            console.log(index + ': ' + line.trim().substring(0, 100));
        }
    }
} catch (e) {
    console.error(e);
}
