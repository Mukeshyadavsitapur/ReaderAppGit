
const fs = require('fs');
const content = fs.readFileSync('app/index.js', 'utf8');

// Regex to find imports
// valid forms:
// import X from '...';
// import { X, Y } from '...';
// import * as X from '...';

const imports = new Set();
const importLines = [];

// Simple regex for 'import { ... } from ...'
const namedImportRegex = /import\s+\{([^}]+)\}\s+from/g;
let match;
while ((match = namedImportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(s => s.trim()).filter(s => s);
    names.forEach(name => {
        // Handle "X as Y"
        const parts = name.split(/\s+as\s+/);
        imports.add(parts[parts.length - 1]);
    });
}

// Simple regex for default imports 'import X from ...'
const defaultImportRegex = /import\s+([a-zA-Z0-9_]+)\s+from/g;
while ((match = defaultImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
}

// Simple regex for namespace imports 'import * as X from ...'
const namespaceImportRegex = /import\s+\*\s+as\s+([a-zA-Z0-9_]+)\s+from/g;
while ((match = namespaceImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
}

// Now check usages
const lines = content.split('\n');
const unused = [];

imports.forEach(name => {
    // We need to count occurrences. 
    // 1 occurrence = detection in import line (or definition)
    // We need to be careful not to count logical checks.
    // A simple regex count \bname\b

    // Construct regex with word boundaries
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    const matches = content.match(regex);

    // If it only appears once, it's likely unused (the import itself)
    // Use > 1 check? 
    // Imports like `{ X, Y }` appear once in the import.
    // So if matches.length === 1, it is definitely unused.
    // BUT, if we have `import { A } ...` and `const B = A`, that's 2.
    // `import A ...` `A()` that's 2.

    if (!matches || matches.length <= 1) {
        unused.push(name);
    }
});

console.log('Unused Imports:', unused);
