import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Project, TeamMember, Client, Task, WebpageComponent, ChatMessage, EnrichedTask, Activity, Volunteer, Case, Document, WebSearchResult, Donation, Event } from '../types';
import { TaskStatus, CasePriority, ActivityStatus, CaseStatus } from '../types';

// IMPORTANT: Do not expose your API key in client-side code in a real application.
// This is for demonstration purposes only. In a production environment, this call
// should be made from a secure backend server.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- Project Management AI ---

export async function generateProjectSummary(
  project: Project,
  client: Client,
  allTeamMembers: TeamMember[],
): Promise<{ summary: string; sources: any[] }> {
  if (!process.env.API_KEY) {
    return { summary: "API key is not configured.", sources: [] };
  }
    
  const prompt = `
    Generate a concise and professional project summary for a project management CRM named Logos Vision.
    The summary should be suitable for a status report to stakeholders.
    Also, find recent news or developments related to the client's industry, which is non-profit consulting focused on "${client.name}".
    Do not use markdown formatting like headings or bullet points, write it as 2-3 paragraphs of plain text.

    Project Details:
    - Name: ${project.name}
    - Client: ${client.name}
    - Description: ${project.description}
    - Status: ${project.status}

    Based on the information above and recent web search results, provide a summary covering the project's objective, current status, and any relevant external context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { summary: response.text, sources: groundingChunks };
  } catch (error) {
    console.error("Error generating project summary:", error);
    return { summary: "An error occurred while generating the summary.", sources: [] };
  }
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskAnalysisResult {
  riskLevel: RiskLevel;
  explanation: string;
}

const riskAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        riskLevel: {
            type: Type.STRING,
            enum: ['Low', 'Medium', 'High'],
            description: 'The assessed risk level for the project.'
        },
        explanation: {
            type: Type.STRING,
            description: 'A concise, natural-language explanation for the assessed risk level, highlighting specific tasks or cases of concern.'
        }
    },
    required: ['riskLevel', 'explanation']
};

export async function analyzeProjectRisk(
  project: Project,
  cases: Case[]
): Promise<RiskAnalysisResult> {
  if (!process.env.API_KEY) {
    return { riskLevel: 'Low', explanation: 'API key not configured.' };
  }

  const today = new Date().toISOString().split('T')[0];

  const relevantCases = cases
    .filter(c => c.priority === CasePriority.High && c.status !== CaseStatus.Closed && c.status !== CaseStatus.Resolved)
    .map(c => `- High-priority case: "${c.title}" (Status: ${c.status}) created on ${new Date(c.createdAt).toLocaleDateString()}`).join('\n');

  const upcomingOrOverdueTasks = project.tasks
    .filter(t => t.status !== TaskStatus.Done)
    .map(t => `- Task: "${t.description}" (Status: ${t.status}) due on ${new Date(t.dueDate).toLocaleDateString()}`).join('\n');

  const prompt = `
    As a proactive project management assistant for a non-profit consulting CRM, analyze the following project data to assess its risk level.
    The current date is ${today}.

    **Project Details:**
    - Name: ${project.name}
    - Description: ${project.description}
    - Status: ${project.status}
    - Start Date: ${project.startDate}
    - End Date: ${project.endDate}

    **Upcoming or Overdue Tasks:**
    ${upcomingOrOverdueTasks || 'No outstanding tasks.'}

    **High-Priority Open Cases for this Client:**
    ${relevantCases || 'No high-priority open cases for this client.'}

    **Analysis Instructions:**
    1.  Evaluate the project's health based on overdue tasks, tasks due soon, project status, and any high-priority open cases that could impact the project.
    2.  Determine a risk level: 'Low' (on track), 'Medium' (some concerns, potential delays), or 'High' (significant issues, high chance of failure or major delay).
    3.  Provide a concise, professional explanation for your assessment. Mention specific tasks or cases that are contributing to the risk. For example, "Risk is Medium because two critical tasks are due within 7 days but are still 'To Do', and a high-priority case regarding a contract was recently opened."
    4.  Return the result as a JSON object adhering to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: riskAnalysisSchema,
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing project risk:", error);
    return { riskLevel: 'Low', explanation: 'An error occurred during risk analysis.' };
  }
}

export interface DonorInsightsResult {
    insights: string;
    suggestion: {
        text: string;
        actionType: 'ScheduleCall' | 'DraftEmail' | 'None';
        actionTitle?: string;
    };
}

const donorInsightsSchema = {
    type: Type.OBJECT,
    properties: {
        insights: {
            type: Type.STRING,
            description: "A concise, 1-2 sentence summary of the donor's behavior, highlighting patterns, trends, or key statistics."
        },
        suggestion: {
            type: Type.OBJECT,
            properties: {
                text: {
                    type: Type.STRING,
                    description: "A single, concrete, actionable next step for the user to take to engage this donor."
                },
                actionType: {
                    type: Type.STRING,
                    enum: ['ScheduleCall', 'DraftEmail', 'None'],
                    description: "The type of action suggested. Use 'ScheduleCall' for follow-ups, 'DraftEmail' for outreach, and 'None' if no specific action is needed."
                },
                actionTitle: {
                    type: Type.STRING,
                    description: "A pre-filled title for the activity if an action is suggested (e.g., 'Follow-up call with...')."
                }
            },
            required: ['text', 'actionType']
        }
    },
    required: ['insights', 'suggestion']
};

export async function generateDonorInsights(
    client: Client,
    donations: Donation[],
    activities: Activity[],
    events: Event[]
): Promise<DonorInsightsResult> {
    if (!process.env.API_KEY) {
        return { insights: 'API Key not configured.', suggestion: { text: '', actionType: 'None' } };
    }

    const prompt = `
        You are an expert fundraising strategist for a non-profit consulting firm. Analyze the provided data for the organization "${client.name}" and generate actionable insights.

        **Data for Analysis (current date: ${new Date().toLocaleDateString()}):**

        *   **Donations History:** ${donations.length > 0 ? JSON.stringify(donations) : "No donation history."}
        *   **Activity History (Calls, Meetings, Emails):** ${activities.length > 0 ? JSON.stringify(activities) : "No activity history."}
        *   **Event Attendance History:** ${events.length > 0 ? JSON.stringify(events) : "No event attendance history."}

        **Instructions:**
        1.  Analyze all provided data to identify patterns in donation timing, frequency, amount changes, and engagement with activities/events.
        2.  Generate a concise (1-2 sentences) insight summary. Example: "${client.name} is a consistent donor, typically contributing in Q3. Their average donation has increased by 15% over the past two years."
        3.  Based on the insight, provide a single, concrete, and actionable suggestion for what the user should do next. Example: "Since their last donation was over 9 months ago, consider scheduling a follow-up call to discuss your upcoming 'Impact Assessment Report'."
        4.  Determine the most appropriate action type ('ScheduleCall', 'DraftEmail', or 'None').
        5.  If an action is suggested, provide a pre-filled title for it.
        6.  Return the response as a single JSON object strictly adhering to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: donorInsightsSchema,
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating donor insights:", error);
        return {
            insights: "An error occurred while generating insights.",
            suggestion: { text: "Please try again later.", actionType: 'None' }
        };
    }
}


export async function generateSpokenText(text: string): Promise<string | null> {
    if (!process.env.API_KEY) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
}

// --- Form Generation ---

const formFieldSchema = {
    type: Type.OBJECT,
    properties: {
        label: { type: Type.STRING, description: 'The user-visible label for the form field.' },
        type: { type: Type.STRING, enum: ['text', 'email', 'phone', 'date', 'textarea', 'checkbox', 'radio', 'select'], description: 'The type of the form input.' },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'For radio or select types, the list of options.' },
    },
    required: ['label', 'type']
};

const formSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'The title of the form.' },
        description: { type: Type.STRING, description: 'A short description of the form\'s purpose.' },
        fields: {
            type: Type.ARRAY,
            items: formFieldSchema,
            description: 'The list of fields in the form.'
        }
    },
    required: ['title', 'description', 'fields']
};

export async function generateFormFromDescription(
  formDescription: string,
  client: Client | null,
): Promise<string> {
    if (!process.env.API_KEY) {
        return JSON.stringify({ error: "API key is not configured." });
    }
    const prompt = `
        You are an AI assistant in a CRM for non-profit consultants. Your task is to generate a JSON structure for a web form based on a user's description.
        The JSON output must strictly adhere to the provided schema.
        User's Form Description: "${formDescription}"
        Client Information: ${client ? `For client: ${client.name}.` : "General template."}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: formSchema }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating form:", error);
        return JSON.stringify({ error: "An error occurred while generating the form." });
    }
}

// --- Email Campaign Generation ---
const emailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: 'A compelling and concise subject line for the email.' },
        body: { type: Type.STRING, description: 'The full body of the email, formatted with appropriate line breaks.' },
    },
    required: ['subject', 'body']
};

const subjectLinesSchema = {
    type: Type.OBJECT,
    properties: {
        subjectA: { type: Type.STRING, description: 'The first compelling and concise subject line variation.' },
        subjectB: { type: Type.STRING, description: 'A second, distinct subject line variation for A/B testing.' },
    },
    required: ['subjectA', 'subjectB']
};


export async function generateEmailContent(prompt: string): Promise<{ subject: string, body: string }> {
    if (!process.env.API_KEY) {
        return { subject: "Error", body: "API key is not configured." };
    }
    const fullPrompt = `
        You are an expert email marketer for non-profit organizations. Your tone should be engaging, professional, and inspiring.
        Based on the following user prompt, generate a compelling subject line and a full email body.
        The body should be well-structured with clear paragraphs.
        Return the response as a JSON object strictly adhering to the provided schema.

        User's Email Goal: "${prompt}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: { responseMimeType: 'application/json', responseSchema: emailSchema }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating email content:", error);
        return { subject: "Generation Failed", body: "Sorry, an error occurred while trying to generate the email content." };
    }
}

export async function generateSubjectLineVariations(prompt: string): Promise<{ subjectA: string, subjectB: string }> {
    if (!process.env.API_KEY) {
        return { subjectA: "Error: API Key not configured", subjectB: "" };
    }
    const fullPrompt = `
        You are an expert email marketer for non-profit organizations. 
        Based on the user's goal, generate two distinct, compelling, and A/B test-worthy subject lines.
        Variation A should be professional and straightforward.
        Variation B should be more creative, urgent, or emotionally engaging.

        User's Email Goal: "${prompt}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: { responseMimeType: 'application/json', responseSchema: subjectLinesSchema }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating subject lines:", error);
        return { subjectA: "Failed to generate subjects.", subjectB: "" };
    }
}

export async function generateGrantNarrative(
  prompt: string,
  contextData?: string
): Promise<string> {
  if (!process.env.API_KEY) return "API key not configured.";
  
  const fullPrompt = `
    You are an expert grant writer for non-profit organizations. Your tone is professional, persuasive, and data-driven.
    Based on the user's request, and incorporating the provided context from their CRM data, write a compelling narrative for a grant application.

    **User Request:**
    "${prompt}"

    ${contextData ? `
    **Relevant CRM Data for Context:**
    ---
    ${contextData}
    ---
    ` : ''}

    Generate the narrative now.
  `;

  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-2.5-pro',
      contents: fullPrompt 
    });
    return response.text;
  } catch (error) {
    console.error("Error generating grant narrative:", error);
    return "An error occurred while generating the narrative.";
  }
}


// --- Gold Pages - Web Design AI ---

const colorPaletteSchema = {
    type: Type.OBJECT,
    properties: {
        primary: { type: Type.STRING, description: 'Primary color hex code (e.g., #FFFFFF)' },
        secondary: { type: Type.STRING, description: 'Secondary color hex code' },
        accent: { type: Type.STRING, description: 'Accent color hex code' },
        text: { type: Type.STRING, description: 'Main text color hex code' },
        background: { type: Type.STRING, description: 'Background color hex code' },
    },
    required: ['primary', 'secondary', 'accent', 'text', 'background']
};

export async function generateColorPalette(themeDescription: string): Promise<string> {
    if (!process.env.API_KEY) return JSON.stringify({ error: "API key is not configured." });
    const prompt = `Generate a cohesive color palette for a webpage based on the theme: "${themeDescription}". Provide hex codes.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: colorPaletteSchema }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating color palette:", error);
        return JSON.stringify({ error: "Failed to generate palette." });
    }
}

export async function generateWebpageText(prompt: string): Promise<string> {
    if (!process.env.API_KEY) return "API key not configured.";
    const fullPrompt = `You are a web copywriter. Write a short, compelling piece of text (e.g., a headline or paragraph) for a non-profit's website based on the following instruction: "${prompt}"`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
        return response.text;
    } catch (error) {
        console.error("Error generating webpage text:", error);
        return "Error generating text.";
    }
}

export async function generateImage(prompt: string, aspectRatio: string): Promise<string | null> {
    if (!process.env.API_KEY) return null;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}

export async function analyzeSeo(content: WebpageComponent[]): Promise<string> {
    if (!process.env.API_KEY) return "API key not configured.";
    const textContent = content.map(c => c.content.text || c.content.headline || '').join('\n');
    const prompt = `
        As an SEO expert, analyze the following webpage content for a non-profit organization.
        Provide actionable suggestions to improve SEO, readability, and engagement.
        Focus on: keyword usage (assume common non-profit terms), clarity of message, calls to action, and heading structure.
        Format your response as markdown.

        Content:
        ---
        ${textContent}
        ---
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 32768 } }
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing SEO:", error);
        return "Error analyzing content.";
    }
}

// --- App-Wide Chat Bot ---

export async function chatWithBot(
  history: ChatMessage[],
  newMessage: string,
  systemInstruction?: string,
): Promise<string> {
    if (!process.env.API_KEY) return "API key not configured.";
    
    const chatHistory = history.map(msg => ({
        role: msg.senderId === 'USER' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({ 
        model: 'gemini-flash-lite-latest',
        history: chatHistory,
        config: systemInstruction ? { systemInstruction } : undefined,
    });
    try {
        const response = await chat.sendMessage({
            message: newMessage
        });
        return response.text;
    } catch (error) {
        console.error("Error in chatWithBot:", error);
        return "Sorry, I encountered an error.";
    }
}

export async function processTextWithAction(text: string, action: 'improve' | 'summarize' | 'clarify'): Promise<string> {
  if (!process.env.API_KEY) return "API key not configured.";
  
  let prompt = '';
  switch (action) {
    case 'improve':
      prompt = `You are an expert copy editor. Improve the following text for clarity, grammar, and professionalism. Return only the improved text, without any introductory phrases. Text: "${text}"`;
      break;
    case 'summarize':
      prompt = `Summarize the following text into a few key points or a concise paragraph. Return only the summary. Text: "${text}"`;
      break;
    case 'clarify':
      prompt = `You are a communication expert. Review the following text and rewrite it to be clearer and more easily understood. Return only the clarified text. Text: "${text}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error processing text:", error);
    return `Error: Could not process text. Original: ${text}`;
  }
}


// --- AI Tools ---

export async function analyzeImage(imageDataB64: string, mimeType: string, prompt: string): Promise<string> {
    if (!process.env.API_KEY) return "API key not configured.";
    try {
        const imagePart = { inlineData: { data: imageDataB64, mimeType } };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [ {text: prompt}, imagePart ] }
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Error analyzing image.";
    }
}

export async function transcribeAudio(audioDataB64: string, mimeType: string): Promise<string> {
    if (!process.env.API_KEY) return "API key not configured.";
    try {
        const audioPart = { inlineData: { data: audioDataB64, mimeType } };
        const textPart = { text: "Transcribe the following audio recording accurately." };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, audioPart] }
        });
        return response.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        return "Error transcribing audio. The model may not support this audio format.";
    }
}

export async function findNearbyPlaces(lat: number, lng: number, query: string): Promise<{ text: string, sources: any[] }> {
  if (!process.env.API_KEY) {
    return { text: "API key is not configured.", sources: [] };
  }
  const prompt = `Find the following near the provided location: "${query}"`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources: groundingChunks };
  } catch (error) {
    console.error("Error finding nearby places:", error);
    return { text: "An error occurred while searching for places.", sources: [] };
  }
}

// --- Reports ---

export async function generateReportSummary(
  data: any[],
  reportGoal: string,
  dataSourceName: string
): Promise<string> {
  if (!process.env.API_KEY) return "API key not configured.";

  const prompt = `
    You are a data analyst for Logos Vision, a consulting firm for non-profits.
    Your task is to analyze the provided data and generate a professional report summary based on the user's goal.

    **User's Goal:** "${reportGoal}"

    **Data Source:** ${dataSourceName}

    **Data (JSON format):**
    ${JSON.stringify(data, null, 2)}

    **Instructions:**
    1.  Analyze the provided data in the context of the user's goal.
    2.  Write a concise, insightful summary.
    3.  Identify key trends, significant figures, or important outliers.
    4.  If applicable, suggest potential action items or areas for further investigation.
    5.  Format your response using markdown for clarity (e.g., headings, bullet points, bold text).
    6.  Do not just list the data; provide interpretation and analysis.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report summary:", error);
    return "An error occurred while generating the report summary.";
  }
}

export async function generateChartInsights(
  chartData: any[],
  dataSourceName: string,
  groupBy: string,
  metric: string,
): Promise<string> {
  if (!process.env.API_KEY) return "- API key is not configured.";

  const prompt = `
    You are a data analyst assistant. Analyze the following summarized data and provide 2-3 concise, insightful bullet points.
    Focus on highs, lows, or interesting patterns. Do not write a long paragraph; use bullet points only, starting each with a hyphen.

    **Data Context:** The data represents the "${metric}" for "${dataSourceName}", grouped by "${groupBy}".

    **Data:**
    ${JSON.stringify(chartData, null, 2)}

    **Example Output:**
    - The 'Annual Gala' campaign generated the most donations.
    - 'Community Outreach' has a significantly lower donation count than other campaigns.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating chart insights:", error);
    return "- Could not generate insights at this time.";
  }
}


// --- Semantic Search ---
interface AllData {
    clients: Client[];
    projects: Project[];
    tasks: EnrichedTask[];
    cases: Case[];
    teamMembers: TeamMember[];
    activities: Activity[];
    volunteers: Volunteer[];
    documents: Document[];
}

interface SearchIdResults {
    clientIds?: string[];
    projectIds?: string[];
    taskIds?: string[];
    caseIds?: string[];
    teamMemberIds?: string[];
    activityIds?: string[];
    volunteerIds?: string[];
    documentIds?: string[];
}

const searchResultsSchema = {
    type: Type.OBJECT,
    properties: {
        clientIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching clients" },
        projectIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching projects" },
        taskIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching tasks" },
        caseIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching cases" },
        teamMemberIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching team members" },
        activityIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching activities" },
        volunteerIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching volunteers" },
        documentIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of matching documents" },
    },
};

const webLeadSchema = {
    type: Type.OBJECT,
    properties: {
        leads: {
            type: Type.ARRAY,
            description: "A list of potential non-profit leads found on the web.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the organization." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of the organization's mission or purpose." },
                    url: { type: Type.STRING, description: "The official website URL for the organization." }
                },
                required: ['name', 'description']
            }
        }
    },
    required: ['leads']
};


export async function performAdvancedSearch(
    query: string,
    allData: AllData,
    includeWebSearch: boolean
): Promise<{ internalResults: SearchIdResults, webResults: WebSearchResult[] }> {
    if (!process.env.API_KEY) {
        console.error("API key is not configured.");
        return { internalResults: {}, webResults: [] };
    }

    // Sanitize data for the prompt to reduce token count
    const minimalData = {
        clients: allData.clients.map(({ id, name, contactPerson, location }) => ({ id, name, contactPerson, location })),
        projects: allData.projects.map(({ id, name, description, status }) => ({ id, name, description, status })),
        tasks: allData.tasks.map(({ id, description, status }) => ({ id, description, status })),
        cases: allData.cases.map(({ id, title, description, status, priority, lastUpdatedAt }) => ({ id, title, description, status, priority, lastUpdatedAt })),
        teamMembers: allData.teamMembers.map(({ id, name, role }) => ({ id, name, role })),
        activities: allData.activities.map(({ id, title, type, notes, activityDate }) => ({ id, title, type, notes, activityDate })),
        volunteers: allData.volunteers.map(({ id, name, skills }) => ({ id, name, skills })),
        documents: allData.documents.map(({ id, name, category }) => ({ id, name, category })),
    };

    const internalPrompt = `
        You are an advanced semantic search engine for a CRM application. Your task is to analyze the user's natural language query and find matching items from the provided JSON data.

        **User Query:** "${query}"
        
        **Date Context:** Assume the current date is ${new Date().toISOString()}. Analyze relative date queries like "this week", "last month", or "recently" based on this date.

        **Available Data:** You have access to the following data sets. Each item has a unique 'id'.
        1. Clients: ${JSON.stringify(minimalData.clients)}
        2. Projects: ${JSON.stringify(minimalData.projects)}
        3. Tasks: ${JSON.stringify(minimalData.tasks)}
        4. Cases: ${JSON.stringify(minimalData.cases)}
        5. Team Members: ${JSON.stringify(minimalData.teamMembers)}
        6. Activities: ${JSON.stringify(minimalData.activities)}
        7. Volunteers: ${JSON.stringify(minimalData.volunteers)}
        8. Documents: ${JSON.stringify(minimalData.documents)}

        **Instructions:**
        1.  Carefully analyze the user's query to understand their intent. This could involve filtering by name, status, priority, date ranges, or relationships between items (e.g., "cases for Global Health").
        2.  Search through all the provided data sets to find items that match the query's intent. The match can be on any relevant field.
        3.  Return a JSON object containing arrays of the unique 'id's for all matching items, strictly adhering to the provided schema. Do not include items that do not match. If no items match a category, return an empty array for that category.
    `;
    
    const internalSearchPromise = ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: internalPrompt,
        config: { 
            responseMimeType: 'application/json', 
            responseSchema: searchResultsSchema 
        }
    });

    let webSearchPromise = Promise.resolve(null);
    if (includeWebSearch) {
        const webPrompt = `
            You are a research assistant for a non-profit consulting firm. Your task is to find potential new leads based on a user's query.
            Use the search tool to find organizations that match the query.
            Return ONLY a raw JSON object (no markdown formatting) containing a list of these leads, following this structure:
            {
              "leads": [
                {
                  "name": "The name of the organization.",
                  "description": "A brief, one-sentence description of the organization's mission or purpose.",
                  "url": "The official website URL for the organization."
                }
              ]
            }

            User Query: "${query}"
        `;
        webSearchPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: webPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
    }

    try {
        const [internalResponse, webResponse] = await Promise.all([internalSearchPromise, webSearchPromise]);

        const internalResults: SearchIdResults = JSON.parse(internalResponse.text);
        let webResults: WebSearchResult[] = [];

        if (webResponse) {
            try {
                let jsonStr = webResponse.text.trim();
                
                // Use a regex to robustly extract the JSON object, even if it's wrapped in markdown or conversational text.
                const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    jsonStr = jsonMatch[0];
                } else {
                    // If no JSON object is found, throw an error to be caught below.
                    throw new Error("No valid JSON object found in the web search response.");
                }
                
                const parsedWeb = JSON.parse(jsonStr);
                const groundingChunks = webResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

                if (parsedWeb.leads && Array.isArray(parsedWeb.leads)) {
                    let sourceIndex = 0;
                    webResults = parsedWeb.leads.map((lead: any) => {
                        const source = groundingChunks[sourceIndex]?.web?.uri;
                        if (groundingChunks[sourceIndex]?.web?.uri) {
                            sourceIndex++;
                        }
                        return {
                            name: lead.name || 'Unknown Name',
                            description: lead.description || 'No description available.',
                            url: lead.url,
                            source: source || '#',
                        };
                    });
                }
            } catch(e) {
                console.error("Error parsing web search results:", e, "Original text from model:", webResponse?.text);
                // Keep webResults as an empty array
            }
        }

        return { internalResults, webResults };
    } catch (error) {
        console.error("Error performing advanced search:", error);
        return { internalResults: {}, webResults: [] };
    }
}


// --- Dashboard Briefing ---

export async function generateDailyBriefing(
  userName: string,
  tasks: EnrichedTask[],
  cases: Case[],
  activities: Activity[],
): Promise<string> {
  if (!process.env.API_KEY) {
    return `Good morning, ${userName}! The AI briefing service is currently unavailable.`;
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  const upcomingTasks = tasks
    .filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate <= oneWeekFromNow && dueDate >= today && t.status !== TaskStatus.Done;
    })
    .map(t => `- Task: "${t.description}" due on ${new Date(t.dueDate).toLocaleDateString()}.`);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  const recentHighPriorityCases = cases
    .filter(c => c.priority === CasePriority.High && new Date(c.createdAt) >= threeDaysAgo)
    .map(c => `- A high-priority case was opened: "${c.title}".`);

  const todaysActivities = activities
    .filter(a => a.activityDate === todayStr && a.status === ActivityStatus.Scheduled)
    .map(a => `- You have a ${a.type.toLowerCase()} scheduled: "${a.title}"${a.activityTime ? ` at ${a.activityTime}` : ''}.`);

  if (upcomingTasks.length === 0 && recentHighPriorityCases.length === 0 && todaysActivities.length === 0) {
      return `Good morning, ${userName}. Your day looks clear! You have no tasks due this week, no recent high-priority cases, and no meetings scheduled for today. Enjoy the calm!`;
  }
  
  const prompt = `
    You are a friendly and professional AI assistant in a CRM called Logos Vision.
    Your task is to generate a personalized "Daily Briefing" for a user named ${userName}.
    The current date is ${today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

    Based on the following data, create a concise, conversational summary. Start with "Good morning, ${userName}."
    Synthesize the information into natural-sounding sentences. Don't just list items with bullet points in the final output. If there are multiple items of one type, group them together. For example, "You have 3 tasks due this week..."

    **Data for Briefing:**
    
    **Upcoming Tasks (due within 7 days):**
    ${upcomingTasks.join('\n') || 'None.'}

    **Recent High-Priority Cases (opened in last 3 days):**
    ${recentHighPriorityCases.join('\n') || 'None.'}

    **Today's Scheduled Activities:**
    ${todaysActivities.join('\n') || 'None.'}

    Generate the summary now as a single block of text, without any markdown formatting like headings or bolding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily briefing:", error);
    return "Apologies, but I couldn't generate your daily briefing at this moment. There might be an issue with the AI service. Please try again later.";
  }
}