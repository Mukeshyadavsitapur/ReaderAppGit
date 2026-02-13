// Helper to Generate Certificate HTML
export const generateCertificateHtml = (userName: string, title: string, score: number, total: number, date: string, attempts: number, quizId: string, timeTaken: string, instructorName: string): string => {
    const percentage: number = Math.round((score / total) * 100);
    // const grade: string = percentage >= 90 ? 'A+' : (percentage >= 80 ? 'A' : (percentage >= 70 ? 'B' : (percentage >= 60 ? 'C' : 'Participant')));

    // Helper for ordinal numbers (1st, 2nd, 3rd)
    const getOrdinal = (n: number): string => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const ordinalAttempt: string = getOrdinal(attempts);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            background-color: #f0f2f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .meta-bar {
            width: 100%;
            max-width: 850px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-family: sans-serif;
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 5px;
        }
        .meta-link {
            text-decoration: none;
            color: #1e3a8a;
            font-weight: bold;
        }
        .certificate-container {
            width: 100%;
            max-width: 850px;
            background-color: #fff;
            padding: 15px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .border-outer {
            border: 5px double #1e3a8a; /* Dark Blue */
            padding: 5px;
            height: 100%;
        }
        .border-inner {
            border: 2px solid #b8860b; /* Gold */
            padding: 40px 30px; /* Reduced side padding */
            text-align: center;
            position: relative;
            background: radial-gradient(circle, #fffff0 0%, #ffffff 100%);
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 150px;
            color: rgba(0,0,0,0.03);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
        }
        .content {
            position: relative;
            z-index: 1;
        }
        .header-logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 3px;
            border-bottom: 2px solid #b8860b;
            display: inline-block;
            padding-bottom: 10px;
        }
        .title {
            font-size: 56px;
            font-weight: bold;
            color: #333;
            margin: 25px 0 10px 0;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
        }
        .student-name {
            font-size: 42px;
            font-weight: bold;
            color: #1e40af;
            margin: 10px 0 25px 0;
            font-family: 'Brush Script MT', cursive;
            text-decoration: underline;
            text-underline-offset: 8px;
            text-decoration-color: #ccc;
        }
        .description {
            font-size: 18px;
            color: #444;
            margin-bottom: 40px;
            line-height: 1.8;
            max-width: 750px;
            margin-left: auto;
            margin-right: auto;
        }
        .highlight-text {
            color: #000;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 20px; /* Reduced padding to give space for middle stamp */
        }
        .signature-block {
            text-align: center;
            width: 200px;
        }
        .sig-line {
            border-top: 1px solid #333;
            margin-top: 8px;
            padding-top: 5px;
            font-size: 14px;
            font-weight: bold;
            color: #444;
        }
        .sig-img {
            font-family: 'Brush Script MT', cursive;
            font-size: 24px;
            color: #1e3a8a;
            margin-bottom: 5px;
        }
        .stamp-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 20px; /* Buffer spacing */
        }
        .stamp {
            width: 100px;
            height: 100px;
            border: 4px double #dc2626; /* RED STAMP */
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #dc2626; /* RED TEXT */
            transform: rotate(-10deg);
            background-color: rgba(220, 38, 38, 0.03);
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.05);
        }
        .stamp-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .stamp-time-rect {
             border: 2px solid #dc2626;
             padding: 4px 8px;
             font-family: 'Courier New', monospace;
             font-size: 14px;
             font-weight: 900;
             background: rgba(255,255,255,0.7);
             letter-spacing: 0px;
        }
        .quiz-id {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 9px;
            color: #aaa;
            font-family: monospace;
        }
        .ad-banner {
            margin-top: 20px;
            width: 100%;
            max-width: 850px;
            padding: 15px;
            background: #fff;
            border: 1px dashed #ccc;
            border-radius: 8px;
            text-align: center;
            font-family: sans-serif;
            color: #555;
            box-sizing: border-box;
        }
        .ad-banner h3 { margin: 0 0 5px 0; font-size: 16px; color: #1e3a8a; }
        .ad-btn {
            display: inline-block;
            background: #1e3a8a;
            color: white;
            padding: 6px 14px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            font-size: 12px;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="meta-bar">
        <span>ID: ${quizId ? quizId.substring(0, 8).toUpperCase() : 'N/A'}</span>
        <a href="https://play.google.com/store/apps/details?id=com.mkysitapur.ReaderApp" class="meta-link">GET THE APP</a>
    </div>

    <div class="certificate-container">
        <div class="border-outer">
            <div class="border-inner">
                <div class="watermark">READER</div>
                <div class="content">
                    <div class="header-logo">ReaderApp</div>
                    
                    <div class="title">Certificate</div>
                    
                    <div class="subtitle">This certifies that</div>
                    
                    <div class="student-name">${userName}</div>
                    
                    <div class="description">
                        has successfully completed the interactive assessment module on<br>
                        <span class="highlight-text" style="font-size: 22px;">${title}</span><br><br>
                        with <strong>${percentage}%</strong> (${score}/${total}) in his <strong>${ordinalAttempt} attempt</strong>.
                    </div>

                    <div class="footer">
                        <div class="signature-block">
                            <div class="sig-img">${new Date(date).toLocaleDateString()}</div>
                            <div class="sig-line">Date Issued</div>
                        </div>
                        
                        <div class="stamp-container">
                            <div class="stamp">
                                <div class="stamp-label">TIME TAKEN</div>
                                <div class="stamp-time-rect">${timeTaken}</div>
                            </div>
                        </div>

                        <div class="signature-block">
                            <div class="sig-img">${instructorName}</div>
                            <div class="sig-line">Instructor</div>
                        </div>
                    </div>
                </div>
                <div class="quiz-id">ID: ${quizId ? quizId.substring(0, 8).toUpperCase() : 'N/A'}</div>
            </div>
        </div>
    </div>

    <div class="ad-banner">
        <h3>🎓 Generated by ReaderApp</h3>
        <p style="font-size: 12px; margin: 0;">Create your own AI quizzes, stories, and notes. Download for Free today!</p>
        <a href="https://play.google.com/store/apps/details?id=com.mkysitapur.ReaderApp" class="ad-btn">Download Now</a>
    </div>
</body>
</html>
    `;
};

// NEW: Helper to normalize keys if LLM translates them (e.g. Hindi keys)
export const normalizeQuizKeys = (questions: any[]) => {
    if (!Array.isArray(questions)) return questions;
    return questions.map(q => {
        // If standard keys exist, assume it's fine
        if (q.question && q.options && q.correctOptionIndex !== undefined) return q;

        const newQ = { ...q };
        const keys = Object.keys(q);

        // 1. Find Options (Array)
        if (!newQ.options) {
            const optionsKey = keys.find(k => Array.isArray(q[k]));
            if (optionsKey) {
                newQ.options = q[optionsKey];
            }
        }

        // 2. Find Correct Index (Number)
        if (newQ.correctOptionIndex === undefined) {
            // Look for number value
            const indexKey = keys.find(k => typeof q[k] === 'number');
            if (indexKey) {
                newQ.correctOptionIndex = q[indexKey];
            } else {
                // Sometimes LLM gives string "0"
                const stringIndexKey = keys.find(k => !isNaN(parseInt(q[k])) && q[k] < 4);
                if (stringIndexKey) newQ.correctOptionIndex = parseInt(q[stringIndexKey]);
            }
        }

        // 3. Find Strings (Question, Explanation, VisualPrompt)
        const stringKeys = keys.filter(k => typeof q[k] === 'string' && k !== 'visualUri');

        // Visual Prompt often has 'prompt', 'visual', 'image' in key
        if (!newQ.visualPrompt) {
            const visKey = stringKeys.find(k => /prompt|visual|image|chitra|tasveer/i.test(k));
            if (visKey) {
                newQ.visualPrompt = q[visKey];
            }
        }

        // Explanation usually matches specific keywords in many languages or is the longest string
        if (!newQ.explanation) {
            const expKey = stringKeys.find(k =>
                /explanation|reason|solution|answer|detail|vyakhya|hal|vivaran|aciklama|explication|beschreibung/i.test(k) && q[k] !== newQ.visualPrompt
            );
            if (expKey) {
                newQ.explanation = q[expKey];
            }
        }

        // Question is whatever is left
        if (!newQ.question) {
            const candidates = stringKeys.filter(k =>
                q[k] !== newQ.options &&
                q[k] !== newQ.visualPrompt &&
                q[k] !== newQ.explanation
            );
            const qKey = candidates.find(k => /question|prashn|pregunta/i.test(k)) || candidates[0];
            if (qKey) newQ.question = q[qKey];
        }

        return newQ;
    });
};

// NEW: Helper to shuffle options to prevent "Option A" bias
export const randomizeQuizData = (questions: any[]) => {
    if (!Array.isArray(questions)) return [];
    return questions.map(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) return q;

        // Safety check for index
        let correctIdx = q.correctOptionIndex;
        if (typeof correctIdx !== 'number' || correctIdx < 0 || correctIdx >= q.options.length) {
            correctIdx = 0; // Default fallback if malformed
        }

        const optsWithStatus = q.options.map((opt: string, idx: number) => ({
            text: opt,
            isCorrect: idx === correctIdx
        }));

        // Fisher-Yates Shuffle
        for (let i = optsWithStatus.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optsWithStatus[i], optsWithStatus[j]] = [optsWithStatus[j], optsWithStatus[i]];
        }

        return {
            ...q,
            options: optsWithStatus.map((o: { text: string; isCorrect: boolean }) => o.text),
            correctOptionIndex: optsWithStatus.findIndex((o: { text: string; isCorrect: boolean }) => o.isCorrect)
        };
    });
};
