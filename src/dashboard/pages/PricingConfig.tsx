import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Settings2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card";
import { Button } from "../../app/components/ui/button";
import { Separator } from "../../app/components/ui/separator";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface PricingConfig {
  featurePricing: Record<string, number>;
  complexityMultipliers: Record<string, number>;
  minimumProjectCost: number;
  maximumProjectCost: number;
  bufferPercentage: number;
  riskFactorMultiplier: number;
}

const DEFAULT_CONFIG: PricingConfig = {
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

function formatFeatureLabel(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function PricingConfig() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeaturePrice, setNewFeaturePrice] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const snap = await getDoc(doc(db, "pricingConfig", "default"));
        if (snap.exists()) {
          setConfig(snap.data() as PricingConfig);
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await setDoc(doc(db, "pricingConfig", "default"), config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateFeaturePrice = (key: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      featurePricing: { ...prev.featurePricing, [key]: value },
    }));
  };

  const removeFeature = (key: string) => {
    setConfig((prev) => {
      const updated = { ...prev.featurePricing };
      delete updated[key];
      return { ...prev, featurePricing: updated };
    });
  };

  const addFeature = () => {
    const key = newFeatureKey
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    const price = parseInt(newFeaturePrice, 10);

    if (!key || isNaN(price) || price <= 0) return;
    if (config.featurePricing[key] !== undefined) {
      setError(`Feature "${formatFeatureLabel(key)}" already exists.`);
      return;
    }

    setConfig((prev) => ({
      ...prev,
      featurePricing: { ...prev.featurePricing, [key]: price },
    }));
    setNewFeatureKey("");
    setNewFeaturePrice("");
    setError(null);
  };

  const updateMultiplier = (key: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      complexityMultipliers: { ...prev.complexityMultipliers, [key]: value },
    }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setError(null);
    setSuccess(false);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all text-sm";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-indigo-500" />
              Pricing Configuration
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Configure internal pricing rules for AI project estimation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Configuration saved successfully.
          </p>
        </motion.div>
      )}

      {/* Feature Pricing */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Feature Base Prices (INR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(config.featurePricing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="flex-1 min-w-0">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                      {formatFeatureLabel(key)}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) =>
                        updateFeaturePrice(key, parseInt(e.target.value, 10) || 0)
                      }
                      className={inputClass}
                    />
                  </label>
                  <button
                    onClick={() => removeFeature(key)}
                    className="mt-5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label={`Remove ${formatFeatureLabel(key)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Add new feature */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  New Feature Name
                </label>
                <input
                  type="text"
                  value={newFeatureKey}
                  onChange={(e) => setNewFeatureKey(e.target.value)}
                  placeholder="e.g., video_conferencing"
                  className={inputClass}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Price (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newFeaturePrice}
                  onChange={(e) => setNewFeaturePrice(e.target.value)}
                  placeholder="10000"
                  className={inputClass}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addFeature}
                disabled={!newFeatureKey.trim() || !newFeaturePrice}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Complexity Multipliers */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Complexity Multipliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(config.complexityMultipliers).map(
                ([key, value]) => (
                  <label key={key}>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                      {key}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={value}
                      onChange={(e) =>
                        updateMultiplier(key, parseFloat(e.target.value) || 0)
                      }
                      className={inputClass}
                    />
                  </label>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estimation Rules */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Estimation Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Minimum Project Cost (INR)
                </span>
                <input
                  type="number"
                  min={0}
                  value={config.minimumProjectCost}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      minimumProjectCost: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className={inputClass}
                />
              </label>
              <label>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Maximum Project Cost (INR)
                </span>
                <input
                  type="number"
                  min={0}
                  value={config.maximumProjectCost}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      maximumProjectCost: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className={inputClass}
                />
              </label>
              <label>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Buffer Percentage (%)
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={config.bufferPercentage}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      bufferPercentage: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className={inputClass}
                />
              </label>
              <label>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Risk Factor Multiplier
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.05}
                  value={config.riskFactorMultiplier}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      riskFactorMultiplier: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
