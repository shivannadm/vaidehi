// src/app/dashboard/routine/habits/components/HabitInsightsModal.tsx
"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import type { CreateHabit, HabitCategory, HabitFrequency } from "@/types/database";

interface HabitInsightsModalProps {
  onClose: () => void;
  onAddHabit: (habit: CreateHabit) => Promise<void>;
  isDark: boolean;
}

const LIFE_CHANGING_HABITS = [
  {
    id: 1,
    habit: "Wake early",
    benefit: "Win the morning",
    icon: "🌅",
    category: "Health" as HabitCategory,
    description: "Start your day before the world wakes up. Morning hours are gold for productivity.",
    color: "#F59E0B"
  },
  {
    id: 2,
    habit: "Water first",
    benefit: "Flush toxins",
    icon: "💧",
    category: "Health" as HabitCategory,
    description: "Hydrate immediately upon waking. Your body needs water after 8 hours of fasting.",
    color: "#06B6D4"
  },
  {
    id: 3,
    habit: "Cold shower",
    benefit: "Boost willpower",
    icon: "🚿",
    category: "Fitness" as HabitCategory,
    description: "Train your mind to do hard things. Cold exposure builds mental toughness.",
    color: "#3B82F6"
  },
  {
    id: 4,
    habit: "Deep breath",
    benefit: "Reset stress",
    icon: "🫁",
    category: "Mental Health" as HabitCategory,
    description: "5 minutes of breathwork can change your entire nervous system. It's free medicine.",
    color: "#8B5CF6"
  },
  {
    id: 5,
    habit: "Walk daily",
    benefit: "Clear your head",
    icon: "🚶",
    category: "Fitness" as HabitCategory,
    description: "10,000 steps daily = clarity, creativity, and cardiovascular health.",
    color: "#10B981"
  },
  {
    id: 6,
    habit: "Sunlight in the morning",
    benefit: "Balance hormones",
    icon: "☀️",
    category: "Health" as HabitCategory,
    description: "Natural light within 30 minutes of waking sets your circadian rhythm perfectly.",
    color: "#F59E0B"
  },
  {
    id: 7,
    habit: "No snooze",
    benefit: "Build discipline",
    icon: "⏰",
    category: "Productivity" as HabitCategory,
    description: "The first decision of your day sets the tone. Snoozing trains you to ignore commitments.",
    color: "#EF4444"
  },
  {
    id: 8,
    habit: "Lift weights",
    benefit: "Build confidence",
    icon: "💪",
    category: "Fitness" as HabitCategory,
    description: "Resistance training builds more than muscle—it builds self-belief and resilience.",
    color: "#F97316"
  },
  {
    id: 9,
    habit: "Phone off in morning",
    benefit: "Gain clarity",
    icon: "📵",
    category: "Digital Wellness" as HabitCategory,
    description: "First hour phone-free = own your mind. Don't let others' priorities hijack your morning.",
    color: "#6366F1"
  },
  {
    id: 10,
    habit: "Eat protein",
    benefit: "Crush cravings",
    icon: "🥩",
    category: "Health" as HabitCategory,
    description: "30g protein within 30 minutes of waking stabilizes blood sugar and kills cravings.",
    color: "#EC4899"
  },
  {
    id: 11,
    habit: "Sleep in the dark",
    benefit: "Boost melatonin",
    icon: "🌙",
    category: "Health" as HabitCategory,
    description: "Complete darkness = deep sleep. Even small light exposure disrupts hormones.",
    color: "#6366F1"
  },
  {
    id: 12,
    habit: "No sugar",
    benefit: "Feel clean",
    icon: "🚫",
    category: "Health" as HabitCategory,
    description: "Cut sugar and watch your energy, skin, and focus transform.",
    color: "#EF4444"
  },
  {
    id: 13,
    habit: "Read 10 minutes",
    benefit: "Train focus",
    icon: "📚",
    category: "Learning" as HabitCategory,
    description: "10 minutes daily = 15+ books per year. Readers are leaders.",
    color: "#3B82F6"
  },
  {
    id: 14,
    habit: "Sit tall",
    benefit: "Feel stronger",
    icon: "🧘",
    category: "Health" as HabitCategory,
    description: "Good posture = confidence and reduced pain.",
    color: "#8B5CF6"
  },
  {
    id: 15,
    habit: "Say 'no'",
    benefit: "Protect your peace",
    icon: "🛡️",
    category: "Mental Health" as HabitCategory,
    description: "'No' is a complete sentence. Protect your time like you protect your money.",
    color: "#F59E0B"
  },
  {
    id: 16,
    habit: "Smile more",
    benefit: "Rewire your brain",
    icon: "😊",
    category: "Mental Health" as HabitCategory,
    description: "Smiling triggers dopamine. Your brain doesn't know if it's real or fake.",
    color: "#EC4899"
  },
  {
    id: 17,
    habit: "Fix posture",
    benefit: "Boost energy",
    icon: "🦴",
    category: "Health" as HabitCategory,
    description: "Stand tall = breathe better = feel better.",
    color: "#10B981"
  },
  {
    id: 18,
    habit: "Fast sometimes",
    benefit: "Heal your body",
    icon: "⏱️",
    category: "Health" as HabitCategory,
    description: "Intermittent fasting triggers autophagy—your body's self-cleaning system.",
    color: "#F97316"
  },
  {
    id: 19,
    habit: "Eat slowly",
    benefit: "Aid digestion",
    icon: "🍽️",
    category: "Health" as HabitCategory,
    description: "Chew 20-30 times per bite. Digestion starts in the mouth.",
    color: "#14B8A6"
  },
  {
    id: 20,
    habit: "Hug someone",
    benefit: "Raise oxytocin",
    icon: "🤗",
    category: "Social" as HabitCategory,
    description: "20-second hugs release oxytocin—the bonding hormone. Physical connection heals.",
    color: "#EC4899"
  },
  {
    id: 21,
    habit: "Hydrate",
    benefit: "Feel alive",
    icon: "💦",
    category: "Health" as HabitCategory,
    description: "2-3 liters daily minimum. Dehydration = brain fog and fatigue.",
    color: "#06B6D4"
  }
];

export default function HabitInsightsModal({ onClose, onAddHabit, isDark }: HabitInsightsModalProps) {
  const [adding, setAdding] = useState<number | null>(null);

  const handleAddHabit = async (habitData: typeof LIFE_CHANGING_HABITS[0]) => {
    setAdding(habitData.id);
    
    try {
      await onAddHabit({
        user_id: "", // Will be set by the parent
        name: habitData.habit,
        description: habitData.description,
        category: habitData.category,
        frequency: "daily" as HabitFrequency,
        target_count: 7,
        icon: habitData.icon,
        color: habitData.color,
        is_active: true,
      });
      
      // Show success briefly before closing
      setTimeout(() => {
        setAdding(null);
      }, 300);
    } catch (error) {
      console.error("Error adding habit:", error);
      setAdding(null);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className={`rounded-2xl w-full max-w-4xl my-8 shadow-2xl border ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700"
            : "bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"
        }`}
      >
        {/* Compact Header */}
        <div
          className={`sticky top-0 z-10 backdrop-blur-xl bg-opacity-95 rounded-t-2xl ${
            isDark ? "bg-slate-900/95" : "bg-white/95"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-lg opacity-40" />
                <div className="relative p-2 rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  HABITS THAT WILL
                </h2>
                <h3 className="text-xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  CHANGE YOUR LIFE
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-2">
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              <span className="font-semibold text-orange-500">21 Science-backed habits</span> to transform your life. 
              Click "Add Habit" to track any of these instantly.
            </p>
          </div>
        </div>

        {/* Compact Habits List */}
        <div className="p-4 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
          {LIFE_CHANGING_HABITS.map((item, index) => (
            <div
              key={item.id}
              className={`group relative rounded-lg p-3 transition-all hover:scale-[1.01] cursor-pointer border ${
                isDark
                  ? "bg-slate-800/60 border-slate-700/50 hover:border-orange-500/30 hover:bg-slate-800"
                  : "bg-slate-50 border-slate-200 hover:border-orange-500/30 hover:bg-white"
              }`}
            >
              {/* Number */}
              <div
                className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-600"
                }`}
              >
                {index + 1}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 right-2">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/20">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  isDark ? "bg-slate-700/50" : "bg-white shadow-sm"
                }`}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-20">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {item.habit}
                    </h4>
                    <span className="text-xs font-bold text-orange-500">
                      {item.benefit}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAddHabit(item)}
                  disabled={adding === item.id}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
                    adding === item.id
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {adding === item.id ? "✓ Added!" : "Add Habit"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Footer */}
        <div className={`p-4 border-t rounded-b-2xl ${
          isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {["🔥", "💪", "🧠"].map((emoji, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border ${
                      isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Start with 3-5 habits and build from there
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold transition-all hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? "#1e293b" : "#f1f5f9"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ef4444);
          border-radius: 10px;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}