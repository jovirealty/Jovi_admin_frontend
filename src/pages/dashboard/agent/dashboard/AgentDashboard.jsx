import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../../../components/breadcrumbs/Breadcrumbs';
import AgentProfileCard from '../../../../components/profilecard/AgentProfileCard';

// Mock data
import { featuredCourses } from '../../../../data/mockagents/featuredCourse';
import { agentProfile } from '../../../../data/mockagents/agentProfile';
import { marketingMaterials } from '../../../../data/mockagents/agentMarketingMaterial';
import { supportStats, agentSupportTickets } from '../../../../data/mockagents/agentSupportStats';
import { tipsAndGuides } from '../../../../data/mockagents/agenttipsandguide';
import { marketUpdates } from '../../../../data/mockagents/agentmarketUpdates';
import { StatBadge } from '../../../../components/badge/StatBadge';

function ViewAllLink({ to, children = 'View all' }){
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200/80 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
    >
      <span>{children}</span>
      <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </Link>
  );
}

function DashboardCard({ title, to, children, className = '' }){
  return (
    <motion.div
      className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          {to && <ViewAllLink to={to}>View all</ViewAllLink>}
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function CourseCard({ course }){
  return (
    <motion.div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-700 dark:to-neutral-700 border border-neutral-200/80 dark:border-neutral-600 hover:shadow-md" whileHover={{ scale: 1.02 }}>
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img src={course.image} alt={course.title} className="w-full h-32 object-cover" />
        <span className="absolute top-2 right-2 rounded-full bg-black/60 text-white text-xs px-2 py-0.5">{course.level}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
        <span>⏱ {course.duration}</span>
        <span>👁 {course.views}</span>
      </div>
      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2">{course.title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">${course.price}/year</span>
        <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5">{course.enrolled ? `${course.enrolled} enrolled` : 'Enroll now'}</span>
      </div>
    </motion.div>
  );
}

function TipsCard({ guide }){
  return (
    <motion.div className="flex items-center gap-3 p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-900/20 hover:shadow-sm" whileHover={{ x: 4 }}>
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">📘</div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{guide.title}</h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{guide.description}</p>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{guide.date} · 👁 {guide.views}</div>
      </div>
    </motion.div>
  );
}

function MaterialCard({ material }){
  return (
    <motion.div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:shadow-sm" whileHover={{ y: -2 }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white font-semibold grid place-content-center">{material.icon}</div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{material.title}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{material.type}</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
        <span>Used {material.count} times</span>
        <span className="rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5">{material.downloads} downloads</span>
      </div>
    </motion.div>
  );
}

function TicketRow({ ticket }){
  const statusMap = {
    Open: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-800',
    Closed: 'bg-neutral-100 text-neutral-700',
  };
  return (
    <motion.div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700" whileHover={{ x: 4 }}>
      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 grid place-content-center text-xs font-semibold">#{ticket.id}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{ticket.title}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{ticket.category}</div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusMap[ticket.status]}`}>{ticket.status}</span>
    </motion.div>
  );
}

export default function AgentDashboard(){
  // (Reserved for future tabbing if needed)
  useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        <AgentProfileCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Tips & Guides" to="/agent/tipsandguides" className="lg:col-span-1">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Total Articles: {tipsAndGuides.length}</p>
            <div className="space-y-3">
              {tipsAndGuides.slice(0,3).map(g => <TipsCard key={g.id} guide={g} />)}
            </div>
          </DashboardCard>

          <DashboardCard title="Marketing Materials" to="/agent/marketing-material" className="lg:col-span-1">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Total Media: {marketingMaterials.totalMedia} items</p>
            <div className="space-y-3">
              {marketingMaterials.lastUploads.map((m,i) => <MaterialCard key={i} material={m} />)}
            </div>
          </DashboardCard>

          <DashboardCard title="Agent Support" to="/agent/agent-support" className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <StatBadge label="Active" value={supportStats.active} color="active" />
              <StatBadge label="Total" value={supportStats.totalIncidents} color="total" />
            </div>
            <div className="space-y-2">
              {agentSupportTickets.slice(0,2).map(t => <TicketRow key={t.id} ticket={t} />)}
            </div>
          </DashboardCard>
        </div>

        <DashboardCard title="Training Hub — Featured Courses" to="/agent/training-hub" className="lg:col-span-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((c,i) => <CourseCard key={i} course={c} />)}
          </div>
        </DashboardCard>

        <DashboardCard title="Market Updates" to="#" className="lg:col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketUpdates.map((u,i) => (
              <motion.div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:shadow" whileHover={{ y: -4 }}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-blue-600"></span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{u.title}</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-1">{u.excerpt}</p>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <span>{u.date}</span>
                      <Link to={u.link} className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                        Read more
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}