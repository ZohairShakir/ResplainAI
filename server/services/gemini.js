import { GoogleGenerativeAI } from '@google/generative-ai';

const AGE_CONFIGS = {
  preschool: { 
    label: 'Preschool', 
    instruction: 'Explain like I am 5. Use very basic words, short sentences, and compare things to toys or animals.'
  },
  middleschool: { 
    label: '12 Years Old', 
    instruction: 'Explain like I am 12. Use relatable analogies about school, sports, or games. No jargon.'
  },
  college: { 
    label: 'College', 
    instruction: 'Explain like a college student. Keep it academic but remove the dense filler. Focus on logic.'
  },
  professional: { 
    label: 'Professional', 
    instruction: 'Executive summary. Focus on ROI, technical breakthroughs, and practical implementation.'
  }
};

export const generateExplanation = async (filename, ageLevel = 'middleschool') => {
  try {
    // Initialize inside the function to ensure process.env is fully loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using the stable, high-speed model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const config = AGE_CONFIGS[ageLevel] || AGE_CONFIGS.middleschool;
    
    const prompt = `Research Paper: "${filename}". 
    Target Audience: ${config.label}.
    Instruction: ${config.instruction}
    
    Please provide:
    1. SUMMARY: A high-level overview.
    2. THE ANALOGY: A real-world comparison.
    3. THE IMPACT: Why this paper matters.
    4. KEY TAKEAWAYS: 3 short points.
    
    IMPORTANT: Do NOT use markdown symbols like * or #. Use plain text only. Use clear section headers in ALL CAPS.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // This will now catch 404s (wrong model name) or 401s (bad key)
    throw new Error('Failed to generate explanation. Please try again.');
  }
};