// src/app/dashboard/routine/health/components/HealthForm.tsx
"use client";

import { useState } from "react";
import {
  Moon, Droplets, Utensils, Activity, Heart, Brain,
  Weight, Thermometer, Gauge, Coffee, Wine, Cigarette,
  TrendingUp, Smile, Frown, Meh, StickyNote, Save,
  ChevronDown, ChevronUp
} from "lucide-react";
import type { HealthEntry } from "../hooks/useHealthTracking";

interface HealthFormProps {
  entry: Partial<HealthEntry>;
  onUpdate: <K extends keyof HealthEntry>(field: K, value: HealthEntry[K]) => void;
  onSave: () => Promise<boolean>;
  saving: boolean;
  isDark: boolean;
}

export default function HealthForm({ entry, onUpdate, onSave, saving, isDark }: HealthFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    sleep: true,
    hydration: true,
    nutrition: true,
    activity: true,
    vitals: true,
    mental: true,
    body: false,
    habits: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      console.log("Health entry saved!");
    }
  };

  // Water glass counter (250ml per glass)
  const waterGlasses = Math.floor((entry.water_intake || 0) / 250);
  const addWaterGlass = () => onUpdate("water_intake", (entry.water_intake || 0) + 250);
  const removeWaterGlass = () => onUpdate("water_intake", Math.max(0, (entry.water_intake || 0) - 250));

  const text = (t: string) => (isDark ? "text-slate-300" : "text-slate-700");

  return (
    <div className={`space-y-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
      {/* ===== SLEEP TRACKING ===== */}
      <Section
        title="💤 Sleep Quality"
        subtitle="Track your sleep patterns"
        isExpanded={expandedSections.sleep}
        onToggle={() => toggleSection('sleep')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Sleep Start
              </label>
              <input
                type="time"
                value={entry.sleep_start || ""}
                onChange={(e) => onUpdate("sleep_start", e.target.value)}
                disabled={saving}
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Wake Time
              </label>
              <input
                type="time"
                value={entry.sleep_end || ""}
                onChange={(e) => onUpdate("sleep_end", e.target.value)}
                disabled={saving}
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              />
            </div>
          </div>
          
          <RatingSlider
            label="Sleep Quality"
            value={entry.sleep_quality ?? 7}
            onChange={(val: any) => onUpdate("sleep_quality", val)}
            min={1}
            max={10}
            lowLabel="Poor"
            highLabel="Excellent"
            isDark={isDark}
            disabled={saving}
          />

          <textarea
            placeholder="Sleep notes (dreams, interruptions, etc.)"
            value={entry.sleep_notes || ""}
            onChange={(e) => onUpdate("sleep_notes", e.target.value)}
            rows={2}
            disabled={saving}
            className={`w-full px-3 py-3 rounded-lg border text-sm resize-none ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 placeholder-slate-400'}`}
          />
        </div>
      </Section>

      {/* ===== HYDRATION ===== */}
      <Section
        title="💧 Hydration"
        subtitle="Stay hydrated throughout the day"
        isExpanded={expandedSections.hydration}
        onToggle={() => toggleSection('hydration')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // toggle to this many glasses quickly (tap target friendly)
                    const target = (i + 1) * 250;
                    onUpdate("water_intake", target);
                  }}
                  type="button"
                  className="p-1"
                  aria-label={`Set ${i + 1} glasses`}
                >
                  <Droplets
                    key={i}
                    className={`w-6 h-6 transition ${i < waterGlasses ? 'text-blue-500 fill-blue-500' : isDark ? 'text-slate-600' : 'text-slate-300'}`}
                  />
                </button>
              ))}
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {waterGlasses}/8 glasses ({entry.water_intake || 0}ml)
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={removeWaterGlass}
              disabled={saving || (entry.water_intake || 0) === 0}
              className={`flex-1 py-3 rounded-lg font-medium transition ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} disabled:opacity-50`}
            >
              - Glass
            </button>
            <button
              onClick={addWaterGlass}
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              + Glass
            </button>
          </div>
        </div>
      </Section>

      {/* ===== NUTRITION ===== */}
      <Section
        title="🍽️ Nutrition"
        subtitle="Log your meals and diet quality"
        isExpanded={expandedSections.nutrition}
        onToggle={() => toggleSection('nutrition')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Meals Logged
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={entry.meals_logged ?? 0}
                onChange={(e) => onUpdate("meals_logged", parseInt(e.target.value) || 0)}
                disabled={saving}
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                value={entry.protein_intake ?? ""}
                onChange={(e) => onUpdate("protein_intake", parseInt(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <RatingSlider
            label="Diet Quality"
            value={entry.diet_quality ?? 7}
            onChange={(val: any) => onUpdate("diet_quality", val)}
            min={1}
            max={10}
            lowLabel="Poor"
            highLabel="Excellent"
            isDark={isDark}
            disabled={saving}
          />
        </div>
      </Section>

      {/* ===== PHYSICAL ACTIVITY ===== */}
      <Section
        title="🏃 Physical Activity"
        subtitle="Track your movement and exercise"
        isExpanded={expandedSections.activity}
        onToggle={() => toggleSection('activity')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Active Minutes
              </label>
              <input
                type="number"
                min="0"
                value={entry.active_minutes ?? 0}
                onChange={(e) => onUpdate("active_minutes", parseInt(e.target.value) || 0)}
                disabled={saving}
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Steps
              </label>
              <input
                type="number"
                min="0"
                value={entry.steps_count ?? ""}
                onChange={(e) => onUpdate("steps_count", parseInt(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              Workout Type
            </label>
            <select
              value={entry.workout_type ?? ""}
              onChange={(e) => onUpdate("workout_type", e.target.value || null)}
              disabled={saving}
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
            >
              <option value="">No workout</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="gym">Gym</option>
              <option value="yoga">Yoga</option>
              <option value="hiit">HIIT</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
              <option value="sports">Sports</option>
            </select>
          </div>
        </div>
      </Section>

      {/* ===== VITALS & RECOVERY ===== */}
      <Section
        title="❤️ Vitals & Recovery"
        subtitle="Monitor your body's recovery"
        isExpanded={expandedSections.vitals}
        onToggle={() => toggleSection('vitals')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Resting HR (BPM)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                value={entry.resting_heart_rate ?? ""}
                onChange={(e) => onUpdate("resting_heart_rate", parseInt(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                HRV (ms)
              </label>
              <input
                type="number"
                min="0"
                value={entry.heart_rate_variability ?? ""}
                onChange={(e) => onUpdate("heart_rate_variability", parseInt(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <RatingSlider
            label="Recovery Score"
            value={entry.recovery_score ?? 7}
            onChange={(val: any) => onUpdate("recovery_score", val)}
            min={1}
            max={10}
            lowLabel="Poor"
            highLabel="Excellent"
            isDark={isDark}
            disabled={saving}
          />

          <RatingSlider
            label="Stress Level"
            value={entry.stress_level ?? 5}
            onChange={(val: any) => onUpdate("stress_level", val)}
            min={1}
            max={10}
            lowLabel="Calm"
            highLabel="Stressed"
            isDark={isDark}
            disabled={saving}
            colorScheme="stress"
          />
        </div>
      </Section>

      {/* ===== MENTAL WELLNESS ===== */}
      <Section
        title="🧠 Mental Wellness"
        subtitle="Mind and mood tracking"
        isExpanded={expandedSections.mental}
        onToggle={() => toggleSection('mental')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              Meditation (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={entry.meditation_minutes ?? 0}
              onChange={(e) => onUpdate("meditation_minutes", parseInt(e.target.value) || 0)}
              disabled={saving}
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
            />
          </div>

          <RatingSlider
            label="Mood"
            value={entry.mood_rating ?? 7}
            onChange={(val: any) => onUpdate("mood_rating", val)}
            min={1}
            max={10}
            lowLabel="😔 Low"
            highLabel="😊 High"
            isDark={isDark}
            disabled={saving}
          />

          <RatingSlider
            label="Anxiety Level"
            value={entry.anxiety_level ?? 5}
            onChange={(val: any) => onUpdate("anxiety_level", val)}
            min={1}
            max={10}
            lowLabel="Calm"
            highLabel="Anxious"
            isDark={isDark}
            disabled={saving}
            colorScheme="stress"
          />
        </div>
      </Section>

      {/* ===== BODY METRICS ===== */}
      <Section
        title="⚖️ Body Metrics"
        subtitle="Track physical measurements"
        isExpanded={expandedSections.body}
        onToggle={() => toggleSection('body')}
        isDark={isDark}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={entry.weight ?? ""}
              onChange={(e) => onUpdate("weight", parseFloat(e.target.value) || null)}
              disabled={saving}
              placeholder="Optional"
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              min="35"
              max="42"
              value={entry.body_temperature ?? ""}
              onChange={(e) => onUpdate("body_temperature", parseFloat(e.target.value) || null)}
              disabled={saving}
              placeholder="Optional"
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              BP Systolic
            </label>
            <input
              type="number"
              min="0"
              value={entry.blood_pressure_systolic ?? ""}
              onChange={(e) => onUpdate("blood_pressure_systolic", parseInt(e.target.value) || null)}
              disabled={saving}
              placeholder="Optional"
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
            />
          </div>
          <div>
            <label className={`text-sm font-medium mb-2 block ${text('')}`}>
              BP Diastolic
            </label>
            <input
              type="number"
              min="0"
              value={entry.blood_pressure_diastolic ?? ""}
              onChange={(e) => onUpdate("blood_pressure_diastolic", parseInt(e.target.value) || null)}
              disabled={saving}
              placeholder="Optional"
              className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
            />
          </div>
        </div>
      </Section>

      {/* ===== LIFESTYLE HABITS ===== */}
      <Section
        title="🎯 Lifestyle Habits"
        subtitle="Daily habits and behaviors"
        isExpanded={expandedSections.habits}
        onToggle={() => toggleSection('habits')}
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border" style={{
            borderColor: isDark ? '#475569' : '#e2e8f0',
            backgroundColor: entry.screen_time_limit_met ? (isDark ? '#052e1f' : '#d1fae5') : (isDark ? '#0f172a' : '#f8fafc')
          }}>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Screen Time Limit Met
            </span>
            <button
              onClick={() => onUpdate("screen_time_limit_met", !entry.screen_time_limit_met)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition ${entry.screen_time_limit_met ? 'bg-green-600 text-white' : isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-300'}`}
            >
              {entry.screen_time_limit_met ? 'Yes' : 'No'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border" style={{
            borderColor: isDark ? '#475569' : '#e2e8f0',
            backgroundColor: entry.smoking_avoided ? (isDark ? '#052e1f' : '#d1fae5') : (isDark ? '#3f1a1a' : '#fee2e2')
          }}>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Avoided Smoking
            </span>
            <button
              onClick={() => onUpdate("smoking_avoided", !entry.smoking_avoided)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition ${entry.smoking_avoided ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
            >
              {entry.smoking_avoided ? 'Yes' : 'No'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Alcohol (units)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={entry.alcohol_units ?? ""}
                onChange={(e) => onUpdate("alcohol_units", parseFloat(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${text('')}`}>
                Caffeine (mg)
              </label>
              <input
                type="number"
                min="0"
                value={entry.caffeine_intake ?? ""}
                onChange={(e) => onUpdate("caffeine_intake", parseInt(e.target.value) || null)}
                disabled={saving}
                placeholder="Optional"
                className={`w-full px-3 py-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ===== NOTES ===== */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <label className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <StickyNote className="w-4 h-4" />
          Daily Notes & Symptoms
        </label>
        <textarea
          placeholder="How do you feel? Any symptoms or achievements?"
          value={entry.notes || ""}
          onChange={(e) => onUpdate("notes", e.target.value)}
          rows={3}
          disabled={saving}
          className={`w-full px-3 py-3 rounded-lg border text-sm resize-none ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 placeholder-slate-400'}`}
        />
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${saving ? 'bg-indigo-500/70 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} text-white shadow-lg`}
      >
        <Save className="w-5 h-5" />
        {saving ? "Saving..." : "Save Health Data"}
      </button>
    </div>
  );
}

// Collapsible Section Component
function Section({ title, subtitle, isExpanded, onToggle, isDark, children }: any) {
  return (
    <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
        aria-expanded={isExpanded}
      >
        <div className="text-left">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isExpanded && (
        <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// Rating Slider Component
function RatingSlider({ label, value, onChange, min, max, lowLabel, highLabel, isDark, disabled, colorScheme = 'default' }: any) {
  const getGradient = () => {
    if (colorScheme === 'stress') {
      return 'linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)';
    }
    return 'linear-gradient(to right, #ef4444 0%, #f59e0b 30%, #10b981 70%, #10b981 100%)';
  };

  return (
    <div>
      <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{ background: getGradient() }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 28px;
            width: 28px;
            border-radius: 50%;
            background: white;
            border: 4px solid #6366f1;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            cursor: grab;
            transition: all 0.18s;
          }
          input[type="range"]::-webkit-slider-thumb:active {
            cursor: grabbing;
            transform: scale(1.05);
          }
        `}</style>
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{lowLabel}</span>
        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{highLabel}</span>
      </div>
    </div>
  );
}
