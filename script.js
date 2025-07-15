document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const projectIdeaInput = document.getElementById('projectIdea');
    const sdgFocusSelect = document.getElementById('sdgFocus');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const projectOutput = document.getElementById('projectOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Updated API keys configuration with fallback keys
    const API_KEYS = [
        'AIzaSyARZVbDWrFoJl3DqE7aVa6lT_N3DPdaW80',  // Primary key
        'AIzaSyCDjKkgkJufNQn21yWMyXOh21Y4G_vHt8', // Backup key 1
		'AIzaSyAqDgSZnIn1P5458gkcF2y3rnIk1TzMY-8', // Backup key 1
		'AIzaSyBoF-VSyuiZ2451gh387_FxATjc6F_Ac', // Backup key 1
		'AIzaSyCo6ez-Bn1H1_Agz7854FlftyIziHpA', // Backup key 1
		'AIzaSyC7S1vwCbXgYx847414p44y_29EOcss', // Backup key 1
        'AIzaSyARZVbDWrFoJl3DqE7647415547aW80'  // Backup key 2
    ];
    let currentApiKeyIndex = 0;
    const getCurrentApiUrl = () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEYS[currentApiKeyIndex]}`;

    generateBtn.addEventListener('click', generateProjectPlan);
    copyBtn.addEventListener('click', copyToClipboard);

    async function generateProjectPlan() {
        const projectIdea = projectIdeaInput.value.trim();
        const sdgFocus = sdgFocusSelect.value;

        if (!projectIdea) {
            alert('Please enter a project idea');
            return;
        }

        loadingSpinner.style.display = 'block';
        resultSection.style.display = 'none';
        generateBtn.disabled = true;
        projectOutput.innerHTML = '';

        try {
            const prompt = createPrompt(projectIdea, sdgFocus);
            const response = await fetch(getCurrentApiUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': API_KEYS[currentApiKeyIndex]
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.5,
                        topP: 0.9,
                        topK: 40,
                        maxOutputTokens: 4096
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if ((response.status === 403 || response.status === 401) && currentApiKeyIndex < API_KEYS.length - 1) {
                    currentApiKeyIndex++;
                    return generateProjectPlan(); // Retry with next key
                }
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';
            displayResults(generatedText);
        } catch (error) {
            console.error('Error:', error);
            projectOutput.innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error generating project plan</h5>
                    <p>${error.message}</p>
                    <p class="small">Please check your API key and try again later.</p>
                </div>
            `;
        } finally {
            loadingSpinner.style.display = 'none';
            resultSection.style.display = 'block';
            generateBtn.disabled = false;
        }
    }

    function createPrompt(projectIdea, sdgFocus) {
        return `As a professional project planner, create a comprehensive project plan for "${projectIdea}" with the following structure:

# Project Overview
[Present this section in a professional two-column table format]

| Category          | Details                                                                 |
|-------------------|-------------------------------------------------------------------------|
| Project Name      | [Create a compelling name]                                              |
| Tagline           | [Create a short, memorable tagline]                                     |
| SDG Focus         | Primary: [SDG X] Secondary: [SDG Y, SDG Z]                              |

# Importance & Description

## Importance
[1-2 concise paragraphs on why this matters]

## Description
[2-3 well-structured paragraphs about the project]

# Objectives and Activities

## Objectives
1. [measurable objective 1]
2. [measurable objective 2]
3. [measurable objective 3]

## Key Activities
| Activity                          | Description                                                                 | Timeline     |
|-----------------------------------|-----------------------------------------------------------------------------|--------------|
| [Activity 1]                      | [Detailed description]                                                      | [Timeframe]  |
| [Activity 2]                      | [Detailed description]                                                      | [Timeframe]  |

# Benefits Analysis
| Benefit Type       | Direct Benefits                            | Indirect Benefits                          |
|--------------------|--------------------------------------------|--------------------------------------------|
| Environmental      | [Specific benefit]                         | [Specific benefit]                         |
| Social             | [Specific benefit]                         | [Specific benefit]                         |
| Economic           | [Specific benefit]                         | [Specific benefit]                         |

# SDG Alignment
| SDG Goal         | Alignment Level (High/Medium/Low) | Specific Contribution                      |
|------------------|-----------------------------------|--------------------------------------------|
| [SDG X]          | High                              | [Detailed explanation]                     |
| [SDG Y]          | Medium                            | [Detailed explanation]                     |

# Implementation Timeline
| Phase            | Activities                         | Start Month | End Month | Status       |
|------------------|------------------------------------|-------------|-----------|--------------|
| Preparation      | [List activities]                  | 1           | 3         | Planned      |
| Execution        | [List activities]                  | 4           | 24        | Planned      |

# Budget Estimates

## Small Budget within 5000 BDT (Basic)
| Item             | Quantity | Unit Cost (BDT) | Total (BDT) |
|------------------|----------|-----------------|-------------|
| [Item 1]         | [Qty]    | [Cost]          | [Total]     |

## Medium Budget within 20000 BDT (Standard)
| Item             | Quantity | Unit Cost (BDT) | Total (BDT) |
|------------------|----------|-----------------|-------------|
| [Item 1]         | [Qty]    | [Cost]          | [Total]     |

## Large Budget within 50000 BDT (Comprehensive)
| Item             | Quantity | Unit Cost (BDT) | Total (BDT) |
|------------------|----------|-----------------|-------------|
| [Item 1]         | [Qty]    | [Cost]          | [Total]     |

# Logframe Matrix
| Goal             | Activities       | Indicators       | Risks & Mitigation                |
|------------------|------------------|------------------|-----------------------------------|
| [Overall goal]   | [Key activity]   | [Measurable]     | [Risk]: [Mitigation strategy]     |

# Beneficiary Analysis
| Type             | Description                                                                 |
|------------------|------------------------------------------------------------------------------|
| Direct           | [Number] [Type] beneficiaries who will directly benefit from [specific way] |
| Indirect         | [Number] [Type] beneficiaries who will indirectly benefit                   |

Format all tables professionally with clear borders and alignment. Use concise but comprehensive language throughout.`;
    }

    function displayResults(text) {
        let html = text
            .replace(/^# (.*$)/gm, '<h2 class="mt-5 mb-4 border-bottom pb-2">$1</h2>')
            .replace(/^## (.*$)/gm, '<h3 class="mt-4 mb-3">$1</h3>')
            .replace(/^### (.*$)/gm, '<h4 class="mt-3 mb-2">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Table conversion
        html = html.replace(/((\|.*?\|.*?\n)+)/g, match => {
            const rows = match.trim().split('\n').filter(line => /^\|.*\|$/.test(line));
            if (rows.length < 2) return match;

            const headers = rows[0].split('|').slice(1, -1).map(h => h.trim());
            const bodyRows = rows.slice(2).map(row =>
                row.split('|').slice(1, -1).map(cell => `<td class="align-middle">${cell.trim()}</td>`).join('')
            );

            const table =
                '<div class="table-responsive"><table class="table table-bordered table-hover mt-3 mb-5">' +
                '<thead class="table-light"><tr>' +
                headers.map(h => `<th class="align-middle">${h}</th>`).join('') +
                '</tr></thead><tbody>' +
                bodyRows.map(row => `<tr>${row}</tr>`).join('') +
                '</tbody></table></div>';

            return table;
        });

        // Lists
        html = html.replace(/(^\d+\.\s.*$)/gm, '<li class="mb-2">$1</li>');
        html = html.replace(/(<li class="mb-2">.*<\/li>)+/g, m => `<ol class="mb-4">${m}</ol>`);

        html = html.replace(/(^-\s.*$)/gm, '<li class="mb-2">$1</li>');
        html = html.replace(/(<li class="mb-2">.*<\/li>)+/g, m => `<ul class="mb-4">${m}</ul>`);

        // Paragraphs
        html = html.replace(/(?:^|\n)(?!\s*<(h[1-6]|ol|ul|li|table|tr|td|th|div|p|blockquote))([^\n<]+)(?=\n|$)/g, (match, _, text) => {
            if (!text.match(/^\s*[\|\-\*\d]/)) {
                return `<p class="mb-3">${text.trim()}</p>`;
            }
            return match;
        });

        projectOutput.innerHTML = html;
    }

    function copyToClipboard() {
        const range = document.createRange();
        range.selectNode(projectOutput);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();

        copyBtn.textContent = 'Copied!';
        copyBtn.classList.remove('btn-outline-secondary');
        copyBtn.classList.add('btn-success');
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-outline-secondary');
        }, 2000);
    }
});
