import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

interface GenerateParams {
  type: 'script' | 'story' | 'voiceover' | 'thumbnail' | 'subtitle' | 'scene';
  prompt: string;
}

export async function generateWithAI({ type, prompt }: GenerateParams) {
  // If no OpenAI key, return high-quality cinematic mock data
  if (!openai) {
    return getMockResult(type, prompt);
  }

  try {
    if (type === 'script' || type === 'story' || type === 'scene') {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a world-class cinematic storyteller and screenwriter working for DesignXpress AI Story Video Studio. 
            Create visually rich, emotionally powerful content. Always respond with clean JSON only.`
          },
          {
            role: "user",
            content: `Generate ${type} content based on this prompt: "${prompt}". 
            Return ONLY valid JSON in this exact shape:
            {
              "title": "string",
              "logline": "string (optional)",
              "scenes": [{ "order": 1, "title": "...", "description": "...", "duration": 12 }]
            }`
          }
        ],
        temperature: 0.85,
        max_tokens: 900,
      });

      const text = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    }

    if (type === 'subtitle') {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You create perfectly timed, cinematic subtitles." },
          { role: "user", content: `Create subtitles for: ${prompt}. Return JSON: { "subtitles": [{ "start": 0, "end": 3.2, "text": "..." }] }` }
        ],
      });
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    }

    if (type === 'voiceover') {
      return await generateVoiceoverWithElevenLabs(prompt);
    }

    if (type === 'thumbnail') {
      return await generateImageWithStability(prompt);
    }

    // Default fallback for other types
    return getMockResult(type, prompt);
  } catch (error) {
    console.error("OpenAI error, falling back to mock:", error);
    return getMockResult(type, prompt);
  }
}

function getMockResult(type: string, prompt: string) {
  const cinematicMocks: any = {
    script: {
      title: "The Last Signal",
      logline: "In a dying world, one woman risks everything to deliver the final message of hope.",
      scenes: [
        { order: 1, title: "The Rain", description: "Neon reflections on wet streets. A hooded figure walks alone through the storm.", duration: 12 },
        { order: 2, title: "The Transmission", description: "She receives a holographic message from her past self across time.", duration: 18 },
      ]
    },
    story: {
      title: "Neon Requiem",
      logline: "A memory thief must choose between erasing her pain or losing her humanity.",
      scenes: [
        { order: 1, title: "Opening", description: "Wide shot of a rain-soaked megacity at night.", duration: 14 },
        { order: 2, title: "The Heist", description: "She breaks into the memory vault.", duration: 22 },
      ]
    },
    scene: {
      scenes: [
        { title: "Establishing Shot", description: "Slow drone push through glowing skyscrapers", duration: 8 },
        { title: "Character Introduction", description: "Close-up on the protagonist's determined eyes", duration: 6 }
      ]
    },
    subtitle: {
      subtitles: [
        { start: 0, end: 3.8, text: "The future belongs to those who create it." },
        { start: 4.5, end: 8.2, text: "DesignXpress AI makes it possible." }
      ]
    },
    voiceover: {
      voiceId: "rachel-cinematic",
      text: prompt,
      audioUrl: "/uploads/temp/mock-voiceover.mp3",
      duration: 38
    },
    thumbnail: {
      imageUrl: "/uploads/temp/mock-thumbnail.jpg",
      promptUsed: prompt
    }
  };

  return cinematicMocks[type] || { message: "AI result generated", prompt };
}

// ===========================================
// ELEVENLABS - Real Voiceover Generation
// ===========================================
export async function generateVoiceoverWithElevenLabs(text: string, voiceId = "21m00Tcm4TlvDq8ikWAM") {
  if (!ELEVENLABS_API_KEY) {
    return getMockResult('voiceover', text);
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.75, similarity_boost: 0.8 },
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      }
    );

    // Save the audio file locally
    const filename = `voiceover_${Date.now()}.mp3`;
    const filePath = `./uploads/temp/${filename}`;
    fs.writeFileSync(filePath, Buffer.from(response.data));

    return {
      voiceId,
      text,
      audioUrl: `/uploads/temp/${filename}`,
      duration: Math.floor(text.length / 12), // rough estimate
    };
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return getMockResult('voiceover', text);
  }
}

// ===========================================
// STABILITY AI - Real Image/Thumbnail Generation
// ===========================================
export async function generateImageWithStability(prompt: string) {
  if (!STABILITY_API_KEY) {
    return getMockResult('thumbnail', prompt);
  }

  try {
    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const image = response.data.artifacts?.[0];
    if (image?.base64) {
      const filename = `thumbnail_${Date.now()}.png`;
      const filePath = `./uploads/temp/${filename}`;
      fs.writeFileSync(filePath, Buffer.from(image.base64, "base64"));
      return {
        imageUrl: `/uploads/temp/${filename}`,
        promptUsed: prompt,
      };
    }
  } catch (error) {
    console.error("Stability AI error:", error);
  }

  return getMockResult('thumbnail', prompt);
}
