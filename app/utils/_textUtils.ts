import { Platform } from 'react-native';

// NEW: Helper to format LaTeX math to Unicode for display
export const formatMathForDisplay = (text: string): string => {
    if (!text) return "";
    let clean: string = text;

    // 1. Basic Replacements
    const replacements: { [key: string]: string } = {
        '\\\\propto': '∝',
        '\\\\approx': '≈',
        '\\\\neq': '≠',
        '\\\\leq': '≤',
        '\\\\le': '≤',
        '\\\\geq': '≥',
        '\\\\ge': '≥',
        '\\\\times': '×',
        '\\\\cdot': '⋅',
        '\\\\pm': '±',
        '\\\\rightarrow': '→',
        '\\\\implies': '⇒',
        '\\\\infty': '∞',
        '\\\\int': '∫',
        '\\\\partial': '∂',
        '\\\\nabla': '∇',
        '\\\\Delta': 'Δ',
        '\\\\pi': 'π',
        '\\\\theta': 'θ',
        '\\\\lambda': 'λ',
        '\\\\sigma': 'σ',
        '\\\\omega': 'ω',
        '\\\\alpha': 'α',
        '\\\\beta': 'β',
        '\\\\gamma': 'γ',
        '\\\\mu': 'μ',
        '\\\\epsilon': 'ε',
        '\\\\rho': 'ρ',
        '\\\\circ': '°',
        '\\\\degree': '°'
    };

    // 2. Fractions: \frac{a}{b} -> (a/b)
    // IMPROVED REGEX: Handles optional spaces and basic nesting
    clean = clean.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1/$2)');
    // Handle simple space separated: \frac a b (rare but possible)
    clean = clean.replace(/\\frac\s+(\w+)\s+(\w+)/g, '($1/$2)');
    // Handle derivatives specifically if they look like \frac{d...}{d...}
    clean = clean.replace(/\\frac\s*\{d\s*([^{}]+)\}\s*\{d\s*([^{}]+)\}/g, 'd$1/d$2');

    // 3. Roots
    clean = clean.replace(/\\sqrt\s*\{([^{}]+)\}/g, '√($1)');

    // 4. Formatting
    clean = clean.replace(/\\text\s*\{([^{}]+)\}/g, '$1');
    clean = clean.replace(/\\mathbf\s*\{([^{}]+)\}/g, '$1');
    clean = clean.replace(/\\mathrm\s*\{([^{}]+)\}/g, '$1');

    // 5. Apply Map replacements
    Object.keys(replacements).forEach(key => {
        clean = clean.replace(new RegExp(key, 'g'), replacements[key]);
    });

    // 6. Sub/Superscripts cleanup (remove braces)
    clean = clean.replace(/\^\{([^{}]+)\}/g, '^$1');
    clean = clean.replace(/_\{([^{}]+)\}/g, '_$1');

    // 7. Cleanup remaining latex garbage
    clean = clean.replace(/\\left/g, '');
    clean = clean.replace(/\\right/g, '');
    clean = clean.replace(/\\/g, ''); // Remove remaining backslashes

    // 8. Final Polish: Fix common spacing issues in formulas
    clean = clean.replace(/\s*\/\s*/g, '/'); // Tighten division (a / b) -> (a/b)
    clean = clean.replace(/\s*\^\s*/g, '^'); // Tighten exponent

    return clean;
};

export const cleanTextForDisplay = (rawText: string): string => {
    if (!rawText) return "";

    // NEW: Format math before stripping other chars
    let processedText: string = formatMathForDisplay(rawText);

    return processedText
        .split('\n')
        .map(line => {
            let clean: string = line.trim();

            // NEW: Remove Table Separator lines (e.g. |---| or | :--- |) completely
            if (/^\|?[\s\-:|]+\|?$/.test(clean)) {
                return '';
            }

            // NEW: Handle Markdown Links [Text](URL) - Keep Text only for TTS/Display cleaning
            clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

            // NEW: Remove App-Specific Tags (Concept Cards, Toggle Tables, Resource Links)
            clean = clean.replace(/\[\[CONCEPT_CARD:\s*(.*?)\]\]/g, '$1. '); // Keep Title, add pause
            clean = clean.replace(/\[\[END_CARD\]\]/g, '');
            clean = clean.replace(/\[\[TOGGLE_TABLE.*?\]\]/g, '');
            clean = clean.replace(/RESOURCE_LINK:\s*https?:\/\/[^\s]+/, '');

            clean = clean.replace(/^#{1,6}\s+/, '');
            clean = clean.replace(/^[\*\-\+]\s+/, '');

            clean = clean.replace(/^>\s+/, '');

            // NEW: Replace pipes with space to match TTS reading behavior (prevents word merge)
            clean = clean.replace(/\|/g, ' ');

            // Remove Markdown chars (updated to preserve some math symbols if they slipped through)
            clean = clean.replace(/(\*\*|__|\*|_|`|~|\[|\]|#|\$)/g, ''); // Removed backslash from here as formatMath handles it
            clean = clean.replace(/[\u2022\u25CF\u25CB\u25A0\u25A1\u25B6\u25C0\u26AB\u26AA\uD83D\uDD34\uD83D\uDD35\u2705\u274C\u2728\u2B50]/g, '');

            // Collapse multiple spaces
            return clean.replace(/\s+/g, ' ').trim();
        })
        .filter(line => line.length > 0) // Filter empty lines to ensure dense text for TTS
        .join('\n');
};

export const getSentenceBounds = (fullText: string, charIndex: number): { start: number; end: number } | null => {
    if (charIndex === null || charIndex === undefined || charIndex < 0) return null;
    let start: number = fullText.lastIndexOf('.', charIndex - 1);
    const start2: number = fullText.lastIndexOf('!', charIndex - 1);
    const start3: number = fullText.lastIndexOf('?', charIndex - 1);
    const start4: number = fullText.lastIndexOf('\n', charIndex - 1);
    start = Math.max(start, start2, start3, start4);
    start = start === -1 ? 0 : start + 1;
    let end: number = fullText.indexOf('.', charIndex);
    const end2: number = fullText.indexOf('!', charIndex);
    const end3: number = fullText.indexOf('?', charIndex);
    const end4: number = fullText.indexOf('\n', charIndex);
    const candidates: number[] = [end, end2, end3, end4].filter(i => i !== -1);
    end = candidates.length > 0 ? Math.min(...candidates) : fullText.length;
    end = Math.min(fullText.length, end + 1);
    return { start, end };
};

export const extractJSON = (text: string): string => {
    if (!text) return "";
    try {
        let clean: string = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        // Locate first and last valid brackets/braces to ignore prologue/epilogue text
        const firstOpenBracket = clean.indexOf('[');
        const firstOpenBrace = clean.indexOf('{');
        const lastCloseBrace = clean.lastIndexOf('}');
        const lastCloseBracket = clean.lastIndexOf(']');

        let start = -1;
        let end = -1;

        // Determine if Object or Array starts first
        if (firstOpenBracket !== -1 && (firstOpenBrace === -1 || firstOpenBracket < firstOpenBrace)) {
            start = firstOpenBracket;
            end = lastCloseBracket;
        } else if (firstOpenBrace !== -1) {
            start = firstOpenBrace;
            end = lastCloseBrace;
        }

        if (start !== -1 && end !== -1 && end > start) {
            return clean.substring(start, end + 1);
        }

        return clean;
    } catch (e) {
        return text;
    }
};

export const repairMalformedJson = (jsonString: string) => {
    let repaired = jsonString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

    // Replace Smart Quotes
    repaired = repaired.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

    // LaTeX Fixes: Double escape backslashes
    repaired = repaired.replace(
        /\\(frac|sqrt|text|cdot|times|pm|theta|pi|infty|int|sum|lim|alpha|beta|gamma|delta|sin|cos|tan|log|ln|neq|leq|geq|approx|div|circ|angle|triangle|deg|left|right|over|mu|sigma|lambda|omega|phi|psi|epsilon|rho|partial|nabla|vec|hat|bar|to|implies|subset|cup|cap|bot|top|vdash|models|mathbb|mathcal|mathbf)/g,
        '\\\\$1'
    );

    repaired = repaired.replace(/\n/g, " ");

    // Fix invalid escapes
    repaired = repaired.replace(/\\([^"\\\/bfnrtu])/g, '$1');

    // Remove trailing backslash
    if (repaired.endsWith('\\')) {
        repaired = repaired.slice(0, -1);
    }

    // Fix single quoted keys/values
    repaired = repaired.replace(/'([^']+?)'\s*:/g, '"$1":');
    repaired = repaired.replace(/:\s*'([^']+?)'\s*([,}])/g, ':"$1"$2');

    // Fix unquoted keys
    repaired = repaired.replace(/([{,]\s*)([^"'{}\[\],:]+?)\s*:/g, '$1"$2":');

    // NEW: Fix unquoted string values (that are not numbers/true/false/null)
    // Looks for: : followed by non-special chars, ending with comma or brace
    // e.g. "key": value, -> "key": "value",
    // Warning: This is aggressive and might catch valid numbers if regex is loose, but 'i' error suggests text.
    // We exclude digits, true, false, null to avoid quoting them.
    repaired = repaired.replace(/:\s*(?!(?:true|false|null|\d|\[|\{))([a-zA-Z_][a-zA-Z0-9_\s\.\-]*?)\s*([,}])/g, ':"$1"$2');

    // Fix missing commas between properties
    repaired = repaired.replace(/(["\d}lue\]])\s+(?=")/g, '$1,');

    // Cleanup trailing commas
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    return repaired;
};

// NEW: Helper to extract the first markdown table from text for context persistence
export const extractFirstTable = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    let tableLines = [];
    let inTable = false;
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('|')) {
            inTable = true;
            tableLines.push(trimmed);
        } else {
            if (inTable) break; // End of contiguous table
        }
    }
    // Needs at least 2 lines to be a valid table context
    if (tableLines.length >= 2) return tableLines.join('\n');
    return null;
};

// --- Helper Functions ---
export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const getFontFamily = (family: string): string => {
    if (family === 'Classic') {
        return Platform.OS === 'ios' ? 'Georgia' : 'serif';
    }
    if (family === 'Typewriter') {
        return Platform.OS === 'ios' ? 'Courier New' : 'monospace';
    }
    if (family === 'Rounded') {
        return Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-rounded';
    }
    if (family === 'Elegant') {
        return Platform.OS === 'ios' ? 'Palatino' : 'serif';
    }
    if (family === 'Compact') {
        return Platform.OS === 'ios' ? 'Arial Narrow' : 'sans-serif-condensed';
    }
    if (family === 'Minimalist') {
        return Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-light';
    }
    if (family === 'Casual') {
        return Platform.OS === 'ios' ? 'Chalkboard SE' : 'sans-serif-medium';
    }
    // Modern (Default) and fallback
    return Platform.OS === 'ios' ? 'System' : 'sans-serif';
};

export const getTypographyStyle = (family: string, styles: string[] = []): any => {
    const base: any = { fontFamily: getFontFamily(family) };
    if (styles.includes('Bold')) base.fontWeight = 'bold';
    if (styles.includes('Italic')) base.fontStyle = 'italic';
    return base;
};
