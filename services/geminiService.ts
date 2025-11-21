
import { GoogleGenAI, Type } from "@google/genai";
import { Nation, BriefingData, ResolutionData, GlobalSimulationData, NationStats, CountryData, LegacyData, Faction, War } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_TEXT = "gemini-2.5-flash";
const MODEL_IMAGE = "imagen-3.0-generate-002"; 

const formatStats = (stats: NationStats) => 
  `Military: ${stats.military}/5, Economy: ${stats.economy}/5, Stability: ${stats.stability}/5, Innovation: ${stats.innovation}/5, Prestige: ${stats.prestige}/5`;

const formatFactions = (factions?: Faction[]) => {
  if (!factions || factions.length === 0) return "No known internal factions yet.";
  return factions.map(f => `${f.name} (Approval: ${f.approval}%)`).join(", ");
};

const formatWars = (wars: War[], nationId: string) => {
  const active = wars.filter(w => w.attackerId === nationId || w.defenderId === nationId);
  if (active.length === 0) return "No active wars.";
  return active.map(w => `WAR: ${w.attackerId} vs ${w.defenderId} (State: ${w.state})`).join("; ");
};

export const generateBriefing = async (
  nation: Nation, 
  year: number,
  historyContext: string[],
  activeWars: War[]
): Promise<BriefingData> => {
  
  const historyStr = historyContext.length > 0 
    ? "RECENT WORLD HISTORY:\n" + historyContext.join("\n") 
    : "No significant recent history.";
  
  const warStr = formatWars(activeWars, nation.id);

  const prompt = `
    Role: Historical Narrator & Political Analyst. 
    Context: Year ${year}. Nation: ${nation.name}.
    Stats: ${formatStats(nation.stats)}.
    Current Factions: ${formatFactions(nation.factions)}.
    Active Wars involving this nation: ${warStr}.
    ${historyStr}
    
    Task: 
    1. Analyze the internal state and WAR status. 
    2. If at war, the briefing MUST focus on the conflict.
    3. Identify 3 key political factions (assign approval 0-100).
    4. Create department reports.
    5. Provide 4 strategic choices.
       - If at war, choices should relate to strategy (attack, defend, negotiate peace).
       - If not at war, choices can be development or starting a war.
    6. Create an image prompt.
    
    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          situation: { type: Type.STRING, description: "Overview of the nation's state." },
          factions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                approval: { type: Type.INTEGER, description: "0-100" },
                description: { type: Type.STRING, description: "Short status (e.g. 'Restless', 'Loyal')" }
              },
              required: ["name", "approval", "description"]
            }
          },
          departments: {
            type: Type.OBJECT,
            properties: {
              military: { type: Type.STRING },
              economic: { type: Type.STRING },
              domestic: { type: Type.STRING },
              foreign: { type: Type.STRING },
              intrigue: { type: Type.STRING }
            },
            required: ["military", "economic", "domestic", "foreign", "intrigue"]
          },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["MILITARY", "DIPLOMATIC", "ECONOMIC", "INTRIGUE", "DOMESTIC"] }
              },
              required: ["id", "text", "type"]
            }
          },
          imagePrompt: { type: Type.STRING }
        },
        required: ["situation", "factions", "departments", "choices", "imagePrompt"]
      }
    }
  });

  if (!response.text) throw new Error("No briefing generated");
  return JSON.parse(response.text) as BriefingData;
};

export const generateResolution = async (
  nation: Nation, 
  year: number, 
  choiceText: string,
  choiceType: string,
  historyContext: string[],
  activeWars: War[]
): Promise<ResolutionData> => {
  
  const historyStr = historyContext.length > 0 
    ? "RECENT WORLD HISTORY:\n" + historyContext.join("\n") 
    : "";
  const warStr = formatWars(activeWars, nation.id);

  const prompt = `
    Role: Historical Game Master.
    Year: ${year}. Nation: ${nation.name}.
    Stats: ${formatStats(nation.stats)}.
    Active Wars: ${warStr}.
    Player Decision (${choiceType}): "${choiceText}".
    ${historyStr}
    
    Task:
    1. Determine outcome.
    2. WAR LOGIC:
       - If decision is to START a war, return a warUpdate with state 'ONGOING'.
       - If decision is to END a war (treaty/surrender), return warUpdate with state 'PEACE_TREATY'.
       - If winning a decisive victory in an existing war, you can end it with 'VICTORY_ATTACKER' or 'VICTORY_DEFENDER'.
    3. CONQUEST LOGIC:
       - If a war ends in victory or a major military invasion succeeds, define a 'territoryTransfer'.
       - regionName: The name of the country/region conquered.
    4. Determine changes to stats and faction approval.
    
    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          globalReaction: { type: Type.STRING },
          statChanges: {
            type: Type.OBJECT,
            properties: {
              military: { type: Type.INTEGER },
              economy: { type: Type.INTEGER },
              stability: { type: Type.INTEGER },
              innovation: { type: Type.INTEGER },
              prestige: { type: Type.INTEGER }
            }
          },
          factionChanges: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                 name: { type: Type.STRING },
                 change: { type: Type.INTEGER }
               }
            }
          },
          territoryTransfer: {
            type: Type.OBJECT,
            properties: {
              regionName: { type: Type.STRING },
              loserId: { type: Type.STRING },
              winnerId: { type: Type.STRING },
              narrative: { type: Type.STRING }
            },
            nullable: true
          },
          warUpdate: {
            type: Type.OBJECT,
            properties: {
               id: { type: Type.STRING, description: "Unique ID for war, e.g., 'war_fra_gbr_1750'" },
               attackerId: { type: Type.STRING },
               defenderId: { type: Type.STRING },
               startYear: { type: Type.INTEGER },
               state: { type: Type.STRING, enum: ["ONGOING", "STALEMATE", "VICTORY_ATTACKER", "VICTORY_DEFENDER", "PEACE_TREATY"] },
               narrative: { type: Type.STRING }
            },
            nullable: true
          }
        },
        required: ["narrative", "globalReaction", "statChanges"]
      }
    }
  });

  if (!response.text) throw new Error("No resolution generated");
  return JSON.parse(response.text) as ResolutionData;
};

export const generateGlobalSimulation = async (
  year: number, 
  activeNationId: string, 
  allNations: Nation[],
  historyContext: string[],
  activeWars: War[]
): Promise<GlobalSimulationData> => {
  
  const historyStr = historyContext.length > 0 
    ? "RECENT WORLD HISTORY:\n" + historyContext.join("\n") 
    : "";

  // Filter existing active wars to inform simulation
  const currentWarsStr = activeWars.length > 0 
    ? "CURRENT ACTIVE WARS: " + JSON.stringify(activeWars)
    : "No major active wars.";

  const otherNations = allNations.filter(n => n.id !== activeNationId);
  const context = otherNations.map(n => `${n.id} (${n.name})`).join("; ");

  const prompt = `
    Role: World Simulation Engine.
    Year: ${year}.
    Active Player Nation: ${activeNationId}.
    Other Major Powers IDs: ${context}.
    ${currentWarsStr}
    ${historyStr}
    
    Task:
    1. Simulate major events for non-player nations.
    2. MANAGE WARS:
       - Check existing wars: Should they end? (Peace or Victory).
       - Check tensions: Should NEW wars start between AI nations?
    3. TERRITORY:
       - If a war ends in victory, you MUST generate a 'territoryTransfer' to reward the winner.
    4. Update stats.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Summary of world events." },
          nationUpdates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nationId: { type: Type.STRING },
                changes: {
                  type: Type.OBJECT,
                  properties: {
                    military: { type: Type.INTEGER },
                    economy: { type: Type.INTEGER },
                    stability: { type: Type.INTEGER },
                    innovation: { type: Type.INTEGER },
                    prestige: { type: Type.INTEGER }
                  }
                }
              },
              required: ["nationId", "changes"]
            }
          },
          newWars: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   id: { type: Type.STRING },
                   attackerId: { type: Type.STRING },
                   defenderId: { type: Type.STRING },
                   startYear: { type: Type.INTEGER },
                   state: { type: Type.STRING, enum: ["ONGOING"] },
                   narrative: { type: Type.STRING }
                }
             }
          },
          endedWars: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   id: { type: Type.STRING, description: "ID of the war ending" },
                   attackerId: { type: Type.STRING },
                   defenderId: { type: Type.STRING },
                   startYear: { type: Type.INTEGER },
                   state: { type: Type.STRING, enum: ["PEACE_TREATY", "VICTORY_ATTACKER", "VICTORY_DEFENDER"] },
                   narrative: { type: Type.STRING }
                }
             }
          },
          territoryTransfers: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
                properties: {
                  regionName: { type: Type.STRING },
                  loserId: { type: Type.STRING },
                  winnerId: { type: Type.STRING },
                  narrative: { type: Type.STRING }
                }
             }
          }
        },
        required: ["summary", "nationUpdates"]
      }
    }
  });

  if (!response.text) throw new Error("No simulation generated");
  return JSON.parse(response.text) as GlobalSimulationData;
};

export const generateLegacy = async (
  nation: Nation,
  startYear: number,
  endYear: number,
  sessionLogs: string[]
): Promise<LegacyData> => {
  const prompt = `
    Role: Historical Archivist.
    Context: The player controlled ${nation.name} from ${startYear} to ${endYear}.
    History: 
    ${sessionLogs.join("\n")}
    
    Task:
    1. Give this era a name.
    2. Summarize the reign, specifically mentioning how internal factions and borders changed.
    3. List 3 major achievements.
    4. Describe the lasting impact.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eraName: { type: Type.STRING },
          summary: { type: Type.STRING },
          majorAchievements: { type: Type.ARRAY, items: { type: Type.STRING } },
          lastingImpact: { type: Type.STRING }
        },
        required: ["eraName", "summary", "majorAchievements", "lastingImpact"]
      }
    }
  });

  if (!response.text) throw new Error("No legacy generated");
  return JSON.parse(response.text) as LegacyData;
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: MODEL_IMAGE,
      prompt: prompt + " historical oil painting style, 18th century masterpiece, detailed, moody lighting.",
      config: {
        numberOfImages: 1,
        aspectRatio: "4:3",
        outputMimeType: "image/jpeg"
      }
    });
    
    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64) {
      return `data:image/jpeg;base64,${base64}`;
    }
    throw new Error("No image generated");
  } catch (e) {
    console.error("Image generation failed", e);
    return "https://placehold.co/800x600/2c241b/eaddcf?text=Image+Generation+Unavailable";
  }
};

export const generateNationProfile = async (locationName: string, year: number): Promise<Nation> => {
  const prompt = `
    Role: Historical Database.
    Task: Identify the primary sovereign power in "${locationName}" in ${year}.
    Output JSON Nation profile with stats (1-5).
    id: lowercase slug.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          rulerTitle: { type: Type.STRING },
          stats: {
            type: Type.OBJECT,
            properties: {
              military: { type: Type.INTEGER },
              economy: { type: Type.INTEGER },
              stability: { type: Type.INTEGER },
              innovation: { type: Type.INTEGER },
              prestige: { type: Type.INTEGER }
            },
            required: ["military", "economy", "stability", "innovation", "prestige"]
          }
        },
        required: ["id", "name", "description", "rulerTitle", "stats"]
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate nation profile");
  return JSON.parse(response.text) as Nation;
};

export const generateCountryData = async (countryName: string, year: number): Promise<CountryData> => {
  const prompt = `
    Role: Historical Encyclopedia.
    Task: Provide facts about "${countryName}" in ${year}.
    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emoji: { type: Type.STRING },
          capital: { type: Type.STRING },
          population: { type: Type.STRING },
          currency: { type: Type.STRING },
          languages: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          historySnippet: { type: Type.STRING },
          funFact: { type: Type.STRING },
          travelTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["emoji", "capital", "population", "currency", "languages", "description", "historySnippet", "funFact", "travelTips"]
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate country data");
  return JSON.parse(response.text) as CountryData;
};
