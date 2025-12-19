// ====================
// FILE: src/app/(landing)/docs/page.tsx - PART 1
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Documentation</h1>

          <div className="prose prose-slate max-w-none">

            {/* GETTING STARTED */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Getting Started</h2>
              <p className="text-lg text-slate-600 mb-6">
                Welcome to Vaidehi—your complete platform for trading excellence and personal productivity.
                This documentation will guide you through every feature, helping you maximize your potential
                as a trader and build sustainable routines for long-term success.
              </p>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-8 my-8">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Quick Start Guide</h3>
                <ol className="list-decimal list-inside space-y-3 text-slate-700">
                  <li className="text-base"><strong>Create Your Account:</strong> Sign up in under 60 seconds with email or social login</li>
                  <li className="text-base"><strong>Complete Your Profile:</strong> Set your trading preferences, timezone, and notification settings</li>
                  <li className="text-base"><strong>Configure Your Dashboard:</strong> Customize widgets and metrics that matter most to you</li>
                  <li className="text-base"><strong>Log Your First Trade:</strong> Record entry, exit, strategy, and psychological state</li>
                  <li className="text-base"><strong>Build Your Routine:</strong> Create morning and evening checklists for consistency</li>
                  <li className="text-base"><strong>Track Your Progress:</strong> Review analytics, insights, and improvement areas weekly</li>
                </ol>
              </div>
            </section>

            {/* TRADING FEATURES */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Trading Features</h2>

              {/* Trading Dashboard */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📊 Trading Dashboard</h3>
                <p className="text-slate-600 mb-4">
                  Your command center for real-time trading performance. The dashboard provides an at-a-glance
                  view of your current trading metrics, equity curve, and recent activity.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Key Components:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Hero Stats:</strong> Total P&L, win rate, profit factor, and Sharpe ratio displayed prominently</li>
                    <li><strong>Equity Curve:</strong> Interactive chart showing your account growth over time</li>
                    <li><strong>Calendar Heatmap:</strong> Visual representation of profitable vs unprofitable days</li>
                    <li><strong>Monthly P&L Chart:</strong> Bar chart comparing monthly performance</li>
                    <li><strong>Win/Loss Distribution:</strong> Donut chart showing winning vs losing trades</li>
                    <li><strong>Recent Activity:</strong> Timeline of your latest trades with quick details</li>
                    <li><strong>Top Strategies:</strong> Performance breakdown by trading strategy</li>
                  </ul>
                </div>
              </div>

              {/* Trading Journal */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📝 Trading Journal</h3>
                <p className="text-slate-600 mb-4">
                  The heart of Vaidehi. Our advanced trading journal goes beyond basic trade logging to capture
                  the complete context of every position you take. Understanding not just what you traded, but
                  why you traded it and how you felt during the process.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Comprehensive Trade Tracking:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Basic Information:</strong> Symbol, direction (long/short), entry/exit prices, position size</li>
                    <li><strong>Financial Metrics:</strong> P&L (rupees and percentage), commission costs, net profit</li>
                    <li><strong>Strategy Assignment:</strong> Tag trades with predefined or custom strategies</li>
                    <li><strong>Market Conditions:</strong> Record market trend, volatility, and relevant news</li>
                    <li><strong>Psychological State:</strong> Document your emotions before, during, and after the trade</li>
                    <li><strong>Trade Reasoning:</strong> Why did you enter? What was your thesis?</li>
                    <li><strong>Custom Tags:</strong> Create unlimited tags for filtering and analysis</li>
                    <li><strong>Trade Notes:</strong> Detailed notes section with markdown support</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Multiple View Modes:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Calendar View:</strong> Visualize trades by date with color-coded P&L indicators</li>
                    <li><strong>List View:</strong> Sortable table with all trade details at a glance</li>
                    <li><strong>Day Detail View:</strong> Deep dive into specific trading days with aggregated metrics</li>
                    <li><strong>Trade Card View:</strong> Visual cards showing key trade information</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Advanced Filtering:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Date Range:</strong> Filter by specific date ranges or presets (today, this week, this month, etc.)</li>
                    <li><strong>Strategy Filter:</strong> View trades from specific strategies only</li>
                    <li><strong>P&L Range:</strong> Filter by profit/loss amount</li>
                    <li><strong>Tag-Based Filtering:</strong> Combine multiple tags for precise filtering</li>
                    <li><strong>Symbol Search:</strong> Find all trades for specific instruments</li>
                  </ul>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📈 Advanced Analytics</h3>
                <p className="text-slate-600 mb-4">
                  Transform raw trade data into actionable insights. Our analytics engine processes your trading
                  history to reveal patterns, strengths, and areas for improvement that aren't obvious from
                  individual trades.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Performance Metrics:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Win Rate:</strong> Percentage of profitable trades with trend analysis</li>
                    <li><strong>Profit Factor:</strong> Ratio of gross profit to gross loss</li>
                    <li><strong>Average Win/Loss:</strong> Mean profit on winning trades vs mean loss on losing trades</li>
                    <li><strong>Risk/Reward Ratio:</strong> Average risk-to-reward across all trades</li>
                    <li><strong>Expectancy:</strong> Average amount you can expect to win/lose per trade</li>
                    <li><strong>Sharpe Ratio:</strong> Risk-adjusted return metric</li>
                    <li><strong>Max Drawdown:</strong> Largest peak-to-trough decline in your account</li>
                    <li><strong>Recovery Factor:</strong> Net profit divided by maximum drawdown</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Visual Analytics:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Cumulative P&L Chart:</strong> Your equity curve over time with drawdown shading</li>
                    <li><strong>Win Rate Trend:</strong> Track how your win percentage evolves</li>
                    <li><strong>P&L Histogram:</strong> Distribution of your profits and losses</li>
                    <li><strong>Strategy Comparison:</strong> Side-by-side performance of different strategies</li>
                    <li><strong>Time Analysis:</strong> Identify your best trading hours and days</li>
                    <li><strong>Trade Distribution:</strong> Visualize how your trades are distributed across metrics</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Risk Analysis:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Position Sizing Analysis:</strong> Are you consistently following your risk management rules?</li>
                    <li><strong>Consecutive Loss Tracking:</strong> Maximum losing streak and recovery time</li>
                    <li><strong>Risk of Ruin Calculator:</strong> Probability of losing your account based on current metrics</li>
                    <li><strong>Volatility Analysis:</strong> How volatile are your returns?</li>
                  </ul>
                </div>
              </div>

              {/* Backtesting */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">⚗️ Backtesting Engine</h3>
                <p className="text-slate-600 mb-4">
                  Before risking real capital on a new strategy, test it against historical data. Our backtesting
                  module allows you to validate your trading ideas and understand their historical performance.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Backtest Features:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Strategy Definition:</strong> Define entry/exit rules, position sizing, and risk parameters</li>
                    <li><strong>Historical Data:</strong> Test against your own historical trades or market data</li>
                    <li><strong>Performance Metrics:</strong> Win rate, profit factor, max drawdown, and more</li>
                    <li><strong>Visual Results:</strong> Equity curve, trade distribution, and monthly performance</li>
                    <li><strong>Trade-by-Trade Breakdown:</strong> See every simulated trade in detail</li>
                    <li><strong>Scenario Analysis:</strong> Test different parameters and compare results</li>
                  </ul>
                </div>
              </div>

              {/* Strategies */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">🎯 Strategy Manager</h3>
                <p className="text-slate-600 mb-4">
                  Organize and compare your trading strategies in one centralized location. Define clear rules,
                  track performance by strategy, and identify which approaches work best for your trading style.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Strategy Organization:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Create Strategies:</strong> Name, describe, and document each trading approach</li>
                    <li><strong>Define Rules:</strong> Entry conditions, exit conditions, risk management</li>
                    <li><strong>Performance Tracking:</strong> Automatic calculation of metrics per strategy</li>
                    <li><strong>Strategy Comparison:</strong> Compare multiple strategies side-by-side</li>
                    <li><strong>Active/Inactive Status:</strong> Mark strategies as active or retired</li>
                    <li><strong>Strategy Notes:</strong> Document learnings, adjustments, and observations</li>
                    <li><strong>Trade Assignment:</strong> Automatically or manually assign trades to strategies</li>
                  </ul>
                </div>
              </div>

              {/* Trading Rules */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📋 Trading Rules</h3>
                <p className="text-slate-600 mb-4">
                  Discipline separates profitable traders from gamblers. Define your trading rules, track
                  adherence, and identify when emotions override your system.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Rule Categories:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Entry Rules:</strong> When can you enter a trade?</li>
                    <li><strong>Exit Rules:</strong> When must you exit?</li>
                    <li><strong>Risk Management:</strong> Position sizing, stop losses, daily loss limits</li>
                    <li><strong>Trading Hours:</strong> When should you trade vs when to stay out?</li>
                    <li><strong>Psychological Rules:</strong> State of mind requirements before trading</li>
                    <li><strong>Market Condition Rules:</strong> What market conditions favor your strategies?</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Rule Tracking:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Adherence Metrics:</strong> Track how often you follow each rule</li>
                    <li><strong>Violation Logging:</strong> Record when and why rules were broken</li>
                    <li><strong>Impact Analysis:</strong> How do rule violations affect your results?</li>
                    <li><strong>Rule Checklist:</strong> Pre-trade checklist to ensure rule compliance</li>
                  </ul>
                </div>
              </div>

              {/* Quick Notes */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📌 Quick Notes</h3>
                <p className="text-slate-600 mb-4">
                  Capture market observations, trade ideas, and learning moments instantly. Not every thought
                  needs to be a full journal entry—quick notes let you record insights on the fly.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Note Features:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Instant Capture:</strong> Add notes in seconds with keyboard shortcuts</li>
                    <li><strong>Categorization:</strong> Tag notes as trade ideas, lessons learned, market observations</li>
                    <li><strong>Date Stamping:</strong> All notes automatically timestamped</li>
                    <li><strong>Search & Filter:</strong> Quickly find notes by keyword, tag, or date</li>
                    <li><strong>Markdown Support:</strong> Format notes with headers, lists, and emphasis</li>
                    <li><strong>Pin Important Notes:</strong> Keep critical notes at the top of your list</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PRODUCTIVITY FEATURES */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Productivity Features</h2>

              {/* Tasks */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">✅ Task Management</h3>
                <p className="text-slate-600 mb-4">
                  Effective traders are organized individuals. Our advanced task management system helps you
                  stay on top of trading-related tasks, research, and ongoing projects.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Task Features:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Create & Track:</strong> Add tasks with due dates, priorities, and descriptions</li>
                    <li><strong>Tag System:</strong> Create custom tags and filter tasks by category</li>
                    <li><strong>Short Notes:</strong> Add quick context to any task</li>
                    <li><strong>Subtasks:</strong> Break down complex tasks into manageable steps</li>
                    <li><strong>Time Tracking:</strong> Monitor how long individual tasks take</li>
                    <li><strong>Auto Timer:</strong> Start task timer automatically when you begin work</li>
                    <li><strong>Focus Goals:</strong> Track and modify your focus time goals</li>
                    <li><strong>Timeline View:</strong> Visualize task completion over time</li>
                    <li><strong>Theme Support:</strong> Dark mode and mobile-optimized interface</li>
                  </ul>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📅 Schedule Management</h3>
                <p className="text-slate-600 mb-4">
                  Time is your most valuable asset. Plan your trading sessions, analysis time, and learning
                  periods with precision using our integrated calendar system.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Scheduling Tools:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Create Events:</strong> Schedule trading sessions, webinars, market events</li>
                    <li><strong>Event Types:</strong> Categorize by purpose (trading time, analysis, education)</li>
                    <li><strong>Smart Reminders:</strong> Get notified before important events</li>
                    <li><strong>Upcoming Events:</strong> List of next 5 scheduled activities</li>
                    <li><strong>Task Transfer:</strong> Convert schedule items directly to tasks</li>
                    <li><strong>Calendar View:</strong> Month view with date indicators</li>
                    <li><strong>Theme & Mobile:</strong> Fully responsive with dark mode support</li>
                  </ul>
                </div>
              </div>

              {/* Projects */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📂 Project Tracking</h3>
                <p className="text-slate-600 mb-4">
                  Larger initiatives require project-level organization. Whether you're learning a new trading
                  strategy, building a watchlist, or researching a sector, project tracking keeps complex work organized.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Advanced Project Management:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Project Creation:</strong> Define projects with descriptions, deadlines, and priorities</li>
                    <li><strong>Multi-Metric Filtering:</strong> Filter by 9 different project attributes</li>
                    <li><strong>Task Integration:</strong> Tasks run directly from project windows</li>
                    <li><strong>Kanban Board:</strong> Visual workflow management with drag-and-drop</li>
                    <li><strong>Timeline View:</strong> Gantt-style project timeline visualization</li>
                    <li><strong>Milestone Tracking:</strong> Set and track key project milestones</li>
                    <li><strong>Task-Project Relations:</strong> Bidirectional linking with main tasks page</li>
                    <li><strong>Progress Monitoring:</strong> Real-time completion percentage tracking</li>
                    <li><strong>Theme Support:</strong> Dark mode and mobile-optimized views</li>
                  </ul>
                </div>
              </div>

              {/* END OF PART 1 - Continue to Part 2 */}
              {/* Trends */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📊 Productivity Trends</h3>
                <p className="text-slate-600 mb-4">
                  Understand your productivity patterns with comprehensive analytics on how you spend your time
                  and accomplish your goals.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Analytics & Insights:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Comprehensive Visuals:</strong> Charts for tasks, schedules, and projects</li>
                    <li><strong>Task Identification:</strong> Find which tasks consume most time</li>
                    <li><strong>Progress Tracking:</strong> Daily, weekly, and monthly completion rates</li>
                    <li><strong>Focus Time Analysis:</strong> Track deep work hours and patterns</li>
                    <li><strong>Focus Goal Calendar:</strong> Daily focus time target tracking</li>
                    <li><strong>Project Distribution:</strong> Time allocation across different projects</li>
                    <li><strong>Color-Coded Themes:</strong> Beautiful visualizations with theme support</li>
                    <li><strong>Export Reports:</strong> Download high-quality trend reports</li>
                    <li><strong>All-in-One View:</strong> Complete productivity overview on single page</li>
                  </ul>
                </div>
              </div>

              {/* Daily Highlights */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">⭐ Daily Highlights & Notes</h3>
                <p className="text-slate-600 mb-4">
                  Focus is the currency of productivity. Identify your single most important task each day,
                  track your progress, and reflect on what matters most.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Highlighting System:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Daily Priority:</strong> Define your top priority for the day</li>
                    <li><strong>Streak Tracking:</strong> Build consistency with day-to-day completion streaks</li>
                    <li><strong>Mood Journaling:</strong> One-click mood tracking for daily reflection</li>
                    <li><strong>Tomorrow Planning:</strong> Set your priority the night before</li>
                    <li><strong>Quick Notes:</strong> Capture to-do items and thoughts instantly</li>
                    <li><strong>Note Management:</strong> Filter, edit, modify, and organize all notes</li>
                    <li><strong>Historical Review:</strong> Look back at previous highlights and learn from patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ROUTINE OPTIMIZATION */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Routine Optimization</h2>

              {/* Morning & Evening Routines */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">🌅 Morning & Evening Routines</h3>
                <p className="text-slate-600 mb-4">
                  Successful trading requires consistent preparation and reflection. Build structured routines
                  that set you up for success each morning and help you learn from each session at night.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Morning Routine Tracking:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Wake Up Time:</strong> Track when you start your day</li>
                    <li><strong>Meditation Duration:</strong> Log mindfulness practice in minutes</li>
                    <li><strong>Self-Improvement:</strong> Count of learning activities (reading, courses, podcasts)</li>
                    <li><strong>Today's Goals:</strong> Write down what you want to accomplish</li>
                    <li><strong>Exercise Count:</strong> Track physical activity sessions</li>
                    <li><strong>Custom Habits:</strong> Add unlimited personal habit checklist items</li>
                    <li><strong>Daily Notes:</strong> Free-form journaling space</li>
                    <li><strong>Sleep Tracking:</strong> Monitor hours and quality from previous night</li>
                    <li><strong>Screen Time:</strong> Track device usage awareness</li>
                    <li><strong>Gratitude Journal:</strong> List 3 things you're grateful for each morning</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Evening Routine Tracking:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Trade Review:</strong> Reflect on today's trading decisions</li>
                    <li><strong>Learning Notes:</strong> Document lessons learned</li>
                    <li><strong>Tomorrow's Preparation:</strong> Plan for the next trading day</li>
                    <li><strong>Evening Habits:</strong> Track wind-down routine completion</li>
                    <li><strong>Progress Reflection:</strong> Rate your day's adherence to plans</li>
                  </ul>
                </div>
              </div>

              {/* Health Tracking */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">💪 Health & Wellness</h3>
                <p className="text-slate-600 mb-4">
                  Physical and mental health directly impact trading performance. Our health tracking helps you
                  correlate wellness metrics with trading results to understand what keeps you at peak performance.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">9 Health Metrics Tracked:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Sleep Time:</strong> Hours slept with quality rating (poor, fair, good, excellent)</li>
                    <li><strong>Sleep Quality:</strong> Subjective assessment of rest quality</li>
                    <li><strong>Hydration:</strong> Daily water intake in liters or cups</li>
                    <li><strong>Exercise:</strong> Type, duration, and intensity of physical activity</li>
                    <li><strong>Heart Rate:</strong> Resting heart rate monitoring</li>
                    <li><strong>Mental Wellness:</strong> Mood and stress level tracking (1-10 scale)</li>
                    <li><strong>Body Metrics:</strong> Weight, body fat percentage, other measurements</li>
                    <li><strong>Custom Lifestyle Habits:</strong> Track personal health practices</li>
                    <li><strong>Compact Dashboard:</strong> Quick-view summary of all health data</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Health Insights:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Trend Analysis:</strong> See how health metrics change over time</li>
                    <li><strong>Correlation with Trading:</strong> Understand health impact on trading performance</li>
                    <li><strong>Streak Tracking:</strong> Build consistency with daily health logging</li>
                    <li><strong>Visual Dashboards:</strong> Charts and graphs for pattern recognition</li>
                  </ul>
                </div>
              </div>

              {/* Habits */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">🔄 Habit Tracking</h3>
                <p className="text-slate-600 mb-4">
                  Small actions, repeated consistently, create extraordinary results. Build and track unlimited
                  habits with our sophisticated habit tracker designed for long-term behavior change.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Comprehensive Habit System:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Unlimited Habits:</strong> Add, modify, and delete as many habits as you need</li>
                    <li><strong>Visual Tracking:</strong> Beautiful, color-coded habit cards</li>
                    <li><strong>Streak Counter:</strong> Track current streak and best streak for motivation</li>
                    <li><strong>Multiple Frequencies:</strong> Daily, weekly, monthly, or custom time frames</li>
                    <li><strong>Completion Rate:</strong> Percentage-based progress tracking</li>
                    <li><strong>Color Coding:</strong> Visual organization with customizable colors</li>
                    <li><strong>Best Streak Badge:</strong> Highlight personal records</li>
                    <li><strong>Habit Notes:</strong> Add context and reminders to habits</li>
                  </ul>
                </div>
              </div>

              {/* Key Notes */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📝 Key Notes</h3>
                <p className="text-slate-600 mb-4">
                  Some insights are too valuable to lose. Key Notes is your repository for important learnings,
                  breakthrough realizations, and crucial reminders that shape your trading and personal growth.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Note Management:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Capture Insights:</strong> Quickly save important thoughts and learnings</li>
                    <li><strong>Categorize Notes:</strong> Organize by type, subject, or importance</li>
                    <li><strong>Search Functionality:</strong> Find notes instantly with keyword search</li>
                    <li><strong>Pin Important Items:</strong> Keep critical notes always visible</li>
                    <li><strong>Date & Time Stamps:</strong> Automatic logging of when insights occurred</li>
                    <li><strong>Export Notes:</strong> Download as text or PDF for external storage</li>
                  </ul>
                </div>
              </div>

              {/* Progress Dashboard */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📊 Progress Analytics</h3>
                <p className="text-slate-600 mb-4">
                  What gets measured gets improved. Our comprehensive progress dashboard aggregates data from
                  all routine modules to show you exactly how you're progressing toward your goals.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Visual Progress Tracking:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Habit Heatmap:</strong> Color-coded calendar showing daily habit completion</li>
                    <li><strong>Health Trends:</strong> Line charts tracking health metrics over time</li>
                    <li><strong>Monthly Summary:</strong> Comprehensive overview of the current month</li>
                    <li><strong>Overview Statistics:</strong> Key metrics at a glance</li>
                    <li><strong>Routine Consistency:</strong> Adherence rates for morning and evening routines</li>
                    <li><strong>Weekly Activity Trends:</strong> 7-day rolling activity patterns</li>
                    <li><strong>Streak Visualization:</strong> Track consistency across all tracked behaviors</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Data Analysis:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Custom Date Ranges:</strong> Analyze any time period</li>
                    <li><strong>Comparison Views:</strong> Week-over-week and month-over-month comparisons</li>
                    <li><strong>Export Functionality:</strong> Download progress reports</li>
                    <li><strong>Insight Highlights:</strong> Automatic detection of patterns and trends</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PLATFORM FEATURES */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Platform Features</h2>

              {/* Data Export */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">💾 Data Export & Backup</h3>
                <p className="text-slate-600 mb-4">
                  Your data is yours. Export any information from Vaidehi in multiple formats for backup,
                  analysis in external tools, or tax reporting purposes.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Export Options:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>PDF Reports:</strong> Professional reports for sharing or printing</li>
                    <li><strong>JSON Export:</strong> Raw data for developers and advanced users</li>
                    <li><strong>High-Quality Images:</strong> Export charts and visualizations</li>
                    <li><strong>Selective Export:</strong> Choose specific date ranges or data types</li>
                    <li><strong>Automated Backups:</strong> Schedule regular data exports</li>
                  </ul>
                </div>
              </div>

              {/* Customization */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">🎨 Customization & Themes</h3>
                <p className="text-slate-600 mb-4">
                  Make Vaidehi yours. Customize the interface, choose themes, and configure the platform to
                  match your workflow and preferences.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Personalization Options:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Dark Mode:</strong> Easy on the eyes for late-night trading sessions</li>
                    <li><strong>Light Mode:</strong> Clean, bright interface for daytime use</li>
                    <li><strong>Custom Tags & Colors:</strong> Create your own organizational system</li>
                    <li><strong>Dashboard Widgets:</strong> Arrange metrics that matter to you</li>
                    <li><strong>Notification Settings:</strong> Control when and how you're alerted</li>
                    <li><strong>Time Zone Configuration:</strong> Accurate timestamping for global traders</li>
                  </ul>
                </div>
              </div>

              {/* Mobile Support */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📱 Mobile Optimization</h3>
                <p className="text-slate-600 mb-4">
                  Trade and track from anywhere. Vaidehi is fully responsive and optimized for smartphones
                  and tablets, ensuring you never miss a beat.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Mobile Features:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Responsive Design:</strong> Perfect experience on any screen size</li>
                    <li><strong>Touch Optimized:</strong> Gesture controls for mobile interaction</li>
                    <li><strong>Offline Capability:</strong> Log trades even without internet (syncs later)</li>
                    <li><strong>Mobile Notifications:</strong> Push alerts for important events</li>
                    <li><strong>Quick Entry:</strong> Optimized forms for fast mobile logging</li>
                  </ul>
                </div>
              </div>

              {/* Security & Privacy */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">🔒 Security & Privacy</h3>
                <p className="text-slate-600 mb-4">
                  Your trading data is sensitive. We implement top-level security measures to ensure your
                  information remains private and protected.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Security Measures:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Regular Security Audits:</strong> Third-party penetration testing</li>
                    <li><strong>Data Privacy:</strong> We never sell or share your data with third parties</li>
                    <li><strong>GDPR Compliant:</strong> Full compliance with data protection regulations</li>
                    <li><strong>Secure Servers:</strong> Enterprise-grade hosting infrastructure</li>
                    <li><strong>Account Recovery:</strong> Secure password reset and account recovery options</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SUPPORT & RESOURCES */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Support & Resources</h2>

              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">💬 Customer Support</h3>
                <p className="text-slate-600 mb-4">
                  We're here to help you succeed. Our support team is responsive, knowledgeable, and committed
                  to ensuring you get the most from Vaidehi.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Support Channels:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Email Support:</strong> support@vaidehi.app</li>
                    <li><strong>Live Chat:</strong> Real-time assistance during business hours</li>
                    <li><strong>Help Center:</strong> Searchable knowledge base with articles and tutorials</li>
                    <li><strong>Video Tutorials:</strong> Step-by-step guides for all features(working on it)</li>
                    <li><strong>Community Forum:</strong> Connect with other traders and share insights(working on it)</li>
                  </ul>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">📚 Learning Resources</h3>
                <p className="text-slate-600 mb-4">
                  Beyond the platform, we provide educational content to help you improve as a trader and
                  build better habits.
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Educational Content:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li><strong>Trading Blog:</strong> Regular articles on trading psychology, strategies, and analysis</li>
                    <li><strong>Routine Guides:</strong> Expert advice on building sustainable habits</li>
                    <li><strong>Webinars:</strong> Live sessions with successful traders and productivity experts</li>
                    <li><strong>Case Studies:</strong> Real examples of traders who improved with Vaidehi</li>
                    <li><strong>Best Practices:</strong> Proven approaches to journaling and routine building</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-lg text-indigo-100 mb-6">
                  Join over Hundreds of people who are improving their performance and building winning habits with Vaidehi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/signup"
                    className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all font-semibold"
                  >
                    Start Free Trial
                  </a>
                  <a
                    href="/contact"
                    className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
                  >
                    Contact Sales
                  </a>
                </div>
                <p className="mt-6 text-sm text-indigo-200">
                  No credit card required • 7-day free trial • Cancel anytime
                </p>
              </div>
            </section>

            {/* FAQ SECTION */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Do I need any trading experience to use Vaidehi?</h4>
                  <p className="text-slate-600">
                    No! While Vaidehi is powerful enough for professional traders, it's designed to be intuitive
                    for beginners. Whether you're taking your first trade or managing a portfolio, Vaidehi adapts
                    to your experience level.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Can I import trades from my broker?</h4>
                  <p className="text-slate-600">
                    No! We are currently working on it.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Is my data safe and private?</h4>
                  <p className="text-slate-600">
                    Absolutely. We are not collecting any high value data from you. And we use secure servers, and never share your data with
                    third parties. Your trading information is completely private and protected by high-level security.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">What markets and instruments does Vaidehi support?</h4>
                  <p className="text-slate-600">
                    Vaidehi works with all markets and instruments: stocks, forex, crypto, options, futures,
                    and more. The platform is instrument-agnostic, so you can track any tradeable asset.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Can I use Vaidehi for day trading, swing trading, and long-term investing?</h4>
                  <p className="text-slate-600">
                    Yes! Vaidehi is flexible enough to accommodate any trading style or timeframe. Day traders
                    can log dozens of trades per day, while swing traders and investors can track fewer,
                    longer-term positions.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">How does the free trial work?</h4>
                  <p className="text-slate-600">
                    Sign up for a 7-day free trial of our Pro plan with no credit card required. Access all
                    premium features, and if you love it, upgrade to continue. If not, you can downgrade to
                    the free Starter plan or cancel completely.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Can I switch between plans?</h4>
                  <p className="text-slate-600">
                    No! we have only one plan for now. But we are working on multiple plans for different user needs.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Does Vaidehi work on mobile devices?</h4>
                  <p className="text-slate-600">
                    Yes! Vaidehi is fully responsive and optimized for smartphones and tablets. Log trades,
                    update routines, and check analytics from any device, anywhere.
                  </p>
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="text-center py-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our support team is here to help. Reach out anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                >
                  Contact Support
                </a>
                <a
                  href="/faq"
                  className="inline-block px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
                >
                  View Full FAQ
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}