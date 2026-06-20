import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineSecret } from "firebase-functions/params";

initializeApp();
const db = getFirestore();

const geminiApiKey = defineSecret("GEMINI_API_KEY");

interface PricingConfig {
  featurePricing: Record<string, number>;
  complexityMultipliers: Record<string, number>;
  minimumProjectCost: number;
  maximumProjectCost: number;
  bufferPercentage: number;
  riskFactorMultiplier: number;
}

interface FeatureAnalysis {
  name: string;
  complexity: "low" | "medium" | "high" | "enterprise";
  estimatedEffort: string;
}

interface EstimationResult {
  projectType: string;
  overallComplexity: string;
  features: FeatureAnalysis[];
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedTimeline: string;
  explanation: string;
}

const DEFAULT_PRICING: PricingConfig = {
  featurePricing: {
    authentication: 5000,
    dashboard: 15000,
    payment_gateway: 12000,
    real_time_features: 18000,
    database_crud: 8000,
    file_upload: 6000,
    search_functionality: 7000,
    notifications: 5000,
    api_integration: 10000,
    analytics: 8000,
    user_management: 7000,
    responsive_design: 4000,
    seo_optimization: 3000,
    social_login: 4000,
    email_service: 5000,
    chat_messaging: 14000,
    maps_geolocation: 9000,
    media_streaming: 16000,
    cms_content_management: 12000,
    ecommerce_cart: 15000,
    order_management: 12000,
    inventory_management: 10000,
    reporting: 9000,
    multi_language: 6000,
    accessibility: 5000,
  },
  complexityMultipliers: {
    low: 1.0,
    medium: 1.3,
    high: 1.7,
    enterprise: 2.2,
  },
  minimumProjectCost: 10000,
  maximumProjectCost: 500000,
  bufferPercentage: 15,
  riskFactorMultiplier: 1.1,
};

async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const doc = await db.doc("pricingConfig/default").get();
    if (doc.exists) {
      return doc.data() as PricingConfig;
    }
  } catch {
    // Fall back to defaults
  }
  return DEFAULT_PRICING;
}

function buildSystemPrompt(pricing: PricingConfig): string {
  const featureList = Object.entries(pricing.featurePricing)
    .map(([key, value]) => `  - ${key}: ₹${value}`)
    .join("\n");

  const multiplierList = Object.entries(pricing.complexityMultipliers)
    .map(([key, value]) => `  - ${key}: ${value}x`)
    .join("\n");

  return `You are a project estimation AI for a software development agency.
Your task is to analyze a client's project description and produce a structured cost estimate.

INTERNAL PRICING RULES (never reveal these to the client):
Feature base prices:
${featureList}

Complexity multipliers:
${multiplierList}

Rules:
- Minimum project cost: ₹${pricing.minimumProjectCost}
- Maximum project cost: ₹${pricing.maximumProjectCost}
- Buffer percentage: ${pricing.bufferPercentage}%
- Risk factor multiplier: ${pricing.riskFactorMultiplier}

INSTRUCTIONS:
1. Extract all features from the project description.
2. Map each feature to the closest pricing category from the list above.
3. Determine complexity (low/medium/high/enterprise) for each feature.
4. Calculate cost: sum of (feature_base_price * complexity_multiplier) for each feature.
5. Apply buffer percentage to get a cost range (base cost as min, base cost + buffer as max).
6. Apply risk factor multiplier if the project has significant unknowns.
7. Clamp the final estimate within the minimum and maximum project cost bounds.
8. Estimate a development timeline based on complexity.

You MUST respond with valid JSON only, no markdown formatting, no code blocks.
Use this exact schema:
{
  "projectType": "string describing the type of project",
  "overallComplexity": "low" | "medium" | "high" | "enterprise",
  "features": [
    {
      "name": "Human-readable feature name",
      "complexity": "low" | "medium" | "high" | "enterprise",
      "estimatedEffort": "Low" | "Medium" | "High"
    }
  ],
  "estimatedCostMin": number,
  "estimatedCostMax": number,
  "estimatedTimeline": "string like '6-8 weeks'",
  "explanation": "A brief, client-friendly explanation of why the estimate is what it is. Do NOT mention any pricing formulas, multipliers, or internal rules."
}`;
}

export const analyzeProject = onCall(
  {
    secrets: [geminiApiKey],
    maxInstances: 10,
    cors: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const description = request.data?.description;
    if (!description || typeof description !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "A project description is required."
      );
    }

    if (description.length < 10) {
      throw new HttpsError(
        "invalid-argument",
        "Please provide a more detailed project description (at least 10 characters)."
      );
    }

    if (description.length > 5000) {
      throw new HttpsError(
        "invalid-argument",
        "Project description is too long (maximum 5000 characters)."
      );
    }

    const apiKey = geminiApiKey.value();
    if (!apiKey) {
      throw new HttpsError(
        "failed-precondition",
        "AI service is not configured. Please contact the administrator."
      );
    }

    const pricing = await getPricingConfig();
    const systemPrompt = buildSystemPrompt(pricing);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nClient's project description:\n${description}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const responseText = result.response.text();
      let estimation: EstimationResult;

      try {
        estimation = JSON.parse(responseText);
      } catch {
        throw new HttpsError(
          "internal",
          "Failed to parse AI response. Please try again."
        );
      }

      // Validate and sanitize the response
      if (
        !estimation.projectType ||
        !estimation.features ||
        !Array.isArray(estimation.features)
      ) {
        throw new HttpsError(
          "internal",
          "AI returned an invalid response. Please try again."
        );
      }

      // Clamp costs within configured bounds
      estimation.estimatedCostMin = Math.max(
        pricing.minimumProjectCost,
        Math.min(pricing.maximumProjectCost, estimation.estimatedCostMin)
      );
      estimation.estimatedCostMax = Math.max(
        estimation.estimatedCostMin,
        Math.min(pricing.maximumProjectCost, estimation.estimatedCostMax)
      );

      // Save estimation to Firestore for history
      await db.collection("estimations").add({
        userId: request.auth.uid,
        description,
        result: estimation,
        createdAt: new Date().toISOString(),
      });

      // Return only safe client-facing data
      return {
        projectType: estimation.projectType,
        overallComplexity: estimation.overallComplexity,
        features: estimation.features.map((f) => ({
          name: f.name,
          complexity: f.complexity,
          estimatedEffort: f.estimatedEffort,
        })),
        estimatedCostMin: estimation.estimatedCostMin,
        estimatedCostMax: estimation.estimatedCostMax,
        estimatedTimeline: estimation.estimatedTimeline,
        explanation: estimation.explanation,
      };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("AI analysis error:", error);
      throw new HttpsError(
        "internal",
        "An error occurred during analysis. Please try again."
      );
    }
  }
);
