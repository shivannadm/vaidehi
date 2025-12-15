// ====================
// FILE: src/app/(landing)/todo/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

export default function TodoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section - UPDATED background gradient for a softer view */}
        <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-indigo-100/50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Stay Organized, Stay Productive
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              A powerful TODO system designed for people who want to maximize their productivity
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Start Organizing Now
            </a>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content - Left */}
            <div className="max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Tasks</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                More advanced tasks page where you can
              </p>
              <ol className="space-y-2 text-slate-700 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">1.</span>
                  <span>Create, Update, delete and track a Task</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">2.</span>
                  <span>Create and manage tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">3.</span>
                  <span>Write a short daily note</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">4.</span>
                  <span>Prioritize your tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">5.</span>
                  <span>Monitor individual tasks duration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">6.</span>
                  <span>Auto timer start after task run</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">7.</span>
                  <span>Track and modify focus Goal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">8.</span>
                  <span>Stunning Task time record timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[1.5rem]">9.</span>
                  <span>Theme supporting and mobile optimization</span>
                </li>
              </ol>
            </div>

            {/* Image - Right (shows first on mobile) */}
            <div className="flex justify-center pointer-events-none select-none order-1 lg:order-2">
              <div className="w-full max-w-[600px] lg:max-w-none transform">
                <Image
                  src="/assets/todo/tasks.png"
                  alt="Tasks Dashboard"
                  width={1919}
                  height={1079}
                  className="w-full h-auto"
                  priority
                  draggable={false}
                  quality={100}
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'contrast(1.05) brightness(1.02)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image - Left */}
              <div className="flex justify-center pointer-events-none select-none order-2 lg:order-1">
                <div className="w-full max-w-[600px] lg:max-w-none transform">
                  <Image
                    src="/assets/todo/schedule.png"
                    alt="Schedule Calendar"
                    width={1906}
                    height={1068}
                    className="w-full h-auto"
                    priority
                    draggable={false}
                    quality={100}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      filter: 'contrast(1.05) brightness(1.02)',
                    }}
                  />
                </div>
              </div>

              {/* Text Content - Right */}
              <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Schedule</h2>
                <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                  More about schedule page where you can
                </p>
                <ol className="space-y-2 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">1.</span>
                    <span>Create, Update, delete and track a Schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">2.</span>
                    <span>Schedule type or purpose selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">3.</span>
                    <span>Prior or 30 min notification reminder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">4.</span>
                    <span>Listing nearest 5 upcomings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">5.</span>
                    <span>Direct transfer to tasks window</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">6.</span>
                    <span>Calender view & indicator on date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">7.</span>
                    <span>Theme supporting and mobile optimization</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Text Content - Left */}
              <div className="max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Projects</h2>
                <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                  Advanced project tracking screen with features like
                </p>
                <ol className="space-y-2 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">1.</span>
                    <span>Create, Update, delete and track a Project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">2.</span>
                    <span>Filter projects with 9 metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">3.</span>
                    <span>Priority, project status, and tracking methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">4.</span>
                    <span>Separate tasks, Kanban, Timeline, & mile stone windows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">5.</span>
                    <span>Tasks can run from project window & Tasks Page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">6.</span>
                    <span>Relation to tasks main page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">7.</span>
                    <span>Monitor each minute in timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">8.</span>
                    <span>Theme supporting and mobile optimization</span>
                  </li>
                </ol>
              </div>

              {/* Image - Right */}
              <div className="flex justify-center pointer-events-none select-none order-1 lg:order-2">
                <div className="w-full max-w-[600px] lg:max-w-none transform rotate-[1deg]">
                  <Image
                    src="/assets/todo/project.png"
                    alt="Project Timeline"
                    width={1919}
                    height={1079}
                    className="w-full h-auto"
                    draggable={false}
                    quality={100}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      filter: 'contrast(1.05) brightness(1.02)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Section */}
        <div className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image - Left */}
              <div className="flex justify-center pointer-events-none select-none order-2 lg:order-1">
                <div className="w-full max-w-[600px] lg:max-w-none lg:scale-115 lg:origin-center">
                  <Image
                    src="/assets/todo/trends.png"
                    alt="Trends Analytics"
                    width={875}
                    height={567}
                    className="w-full h-auto"
                    priority
                    draggable={false}
                    quality={100}
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      filter: "contrast(1.05) brightness(1.02)",
                    }}
                  />
                </div>
              </div>

              {/* Text Content - Right */}
              <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Trends</h2>
                <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                  Advanced visuals for everything you do on tasks
                </p>
                <ol className="space-y-2 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">1.</span>
                    <span>Comprehensive visuals for tasks, schedules, projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">2.</span>
                    <span>Findout which tasks got more time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">3.</span>
                    <span>Daily, weekly, monthly progress tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">4.</span>
                    <span>Daily, weekly, monthly focus time track</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">5.</span>
                    <span>Focus goal calender for each day traking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">6.</span>
                    <span>Time, project distribution visual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">7.</span>
                    <span>Timeline record window for last 30days in track</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">8.</span>
                    <span>Top notch colors and theme supprotive visuals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">9.</span>
                    <span>Download report and save high quality image</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">10.</span>
                    <span>Get all in one page that's Trends of todo</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Highlights Section */}
        <div className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Text Content - Left */}
              <div className="max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
                  Daily Highlights and Notes
                </h2>
                <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                  Know your day's top priority or Days highest satisfied note
                </p>
                <ol className="space-y-2 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">1.</span>
                    <span>You can track streaks here</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">2.</span>
                    <span>Your mood journal in one click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">3.</span>
                    <span>Note for tomorrows priority here</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">4.</span>
                    <span>ToDo Notes for quick note</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[1.5rem]">5.</span>
                    <span>Filter notes, edit, modify and delete notes</span>
                  </li>
                </ol>
              </div>

              {/* Image - Right */}
              <div className="flex justify-center pointer-events-none select-none order-1 lg:order-2">
                <div className="w-full max-w-[480px] transform rotate-[2deg]">
                  <Image
                    src="/assets/todo/highlight.png"
                    alt="Daily Highlights"
                    width={869}
                    height={745}
                    className="w-full h-auto"
                    draggable={false}
                    quality={100}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      filter: 'contrast(1.05) brightness(1.02)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Supercharge Your Productivity?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of productive people who organize their life with Vaidehi
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3.5 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Start Organizing Now
            </a>
            <p className="text-sm text-indigo-200 mt-4">
              Free forever • No credit card required • Start in seconds
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
