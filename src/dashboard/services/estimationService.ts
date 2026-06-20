import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import type { EstimationResult, EstimationRecord } from "../types";

const functions = getFunctions();

interface AnalyzeProjectResponse {
  projectType: string;
  overallComplexity: string;
  features: {
    name: string;
    complexity: string;
    estimatedEffort: string;
  }[];
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedTimeline: string;
  explanation: string;
}

export async function analyzeProject(
  description: string,
): Promise<EstimationResult> {
  const callable = httpsCallable<
    { description: string },
    AnalyzeProjectResponse
  >(functions, "analyzeProject");

  const response = await callable({ description });
  const data = response.data;

  return {
    projectType: data.projectType,
    overallComplexity: data.overallComplexity as EstimationResult["overallComplexity"],
    features: data.features.map((f) => ({
      name: f.name,
      complexity: f.complexity as "low" | "medium" | "high" | "enterprise",
      estimatedEffort: f.estimatedEffort,
    })),
    estimatedCostMin: data.estimatedCostMin,
    estimatedCostMax: data.estimatedCostMax,
    estimatedTimeline: data.estimatedTimeline,
    explanation: data.explanation,
  };
}

export async function fetchEstimationHistory(
  uid: string,
): Promise<EstimationRecord[]> {
  const q = query(
    collection(db, "estimations"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as EstimationRecord[];
}
