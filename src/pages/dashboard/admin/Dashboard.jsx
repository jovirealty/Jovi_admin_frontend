// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* -------------------------- animation variants -------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const hoverLift = { whileHover: { y: -2, scale: 1.01 } };

/* ------------------------------ color variants ------------------------------ */
/** Avoid dynamic Tailwind class names (e.g., border-${color}-200) because
 *  they are purged by the compiler. Use explicit mappings instead. */
const colorVariants = {
  blue: {
    card:
      "border-blue-200 bg-blue-50/60 dark:bg-blue-900/20 dark:border-blue-800/30",
    icon: "bg-blue-100 dark:bg-blue-900/50",
    bar: "bg-blue-500",
    stroke: "text-blue-500",
  },
  indigo: {
    card:
      "border-indigo-200 bg-indigo-50/60 dark:bg-indigo-900/20 dark:border-indigo-800/30",
    icon: "bg-indigo-100 dark:bg-indigo-900/50",
    bar: "bg-indigo-500",
    stroke: "text-indigo-500",
  },
  green: {
    card:
      "border-green-200 bg-green-50/60 dark:bg-green-900/20 dark:border-green-800/30",
    icon: "bg-green-100 dark:bg-green-900/50",
    bar: "bg-green-500",
    stroke: "text-green-500",
  },
  purple: {
    card:
      "border-purple-200 bg-purple-50/60 dark:bg-purple-900/20 dark:border-purple-800/30",
    icon: "bg-purple-100 dark:bg-purple-900/50",
    bar: "bg-purple-500",
    stroke: "text-purple-500",
  },
  yellow: {
    card:
      "border-yellow-200 bg-yellow-50/60 dark:bg-yellow-900/20 dark:border-yellow-800/30",
    icon: "bg-yellow-100 dark:bg-yellow-900/50",
    bar: "bg-yellow-500",
    stroke: "text-yellow-500",
  },
  pink: {
    card:
      "border-pink-200 bg-pink-50/60 dark:bg-pink-900/20 dark:border-pink-800/30",
    icon: "bg-pink-100 dark:bg-pink-900/50",
    bar: "bg-pink-500",
    stroke: "text-pink-500",
  },
  teal: {
    card:
      "border-teal-200 bg-teal-50/60 dark:bg-teal-900/20 dark:border-teal-800/30",
    icon: "bg-teal-100 dark:bg-teal-900/50",
    bar: "bg-teal-500",
    stroke: "text-teal-500",
  },
  gray: {
    card:
      "border-neutral-200 bg-neutral-50/60 dark:bg-neutral-900/30 dark:border-neutral-700",
    icon: "bg-neutral-100 dark:bg-neutral-800",
    bar: "bg-neutral-500",
    stroke: "text-neutral-500",
  },
};

/* --------------------------------- helpers --------------------------------- */
const StatCard = ({ icon, label, value, sub, color = "gray" }) => {
  const v = colorVariants[color] ?? colorVariants.gray;
  return (
    <motion.div
      variants={fadeUp}
      {...hoverLift}
      className={[
        "flex flex-col rounded-xl p-4 border",
        v.card,
        "min-w-0",
      ].join(" ")}
      role="region"
      aria-label={label}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.icon}`} aria-hidden>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {value}
          </div>
          {sub && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SectionCard = ({ title, description, action, children }) => (
  <motion.section
    variants={fadeUp}
    {...hoverLift}
    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 md:p-5"
    role="region"
    aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-title`}
  >
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h3
          id={`${title.replace(/\s+/g, "-").toLowerCase()}-title`}
          className="text-sm font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300"
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
    {children}
  </motion.section>
);

const ListItem = ({ title, subtitle, right, avatar }) => (
  <li className="flex items-center justify-between gap-3 py-2">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm text-neutral-900 dark:text-neutral-100 truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {right && <div className="text-xs text-neutral-500 dark:text-neutral-400">{right}</div>}
  </li>
);

/* ---------------------------------- charts --------------------------------- */
const BarChart = ({ data, color = "blue" }) => {
  const v = colorVariants[color] ?? colorVariants.blue;
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between h-24 gap-1">
        {data.map((item, i) => (
          <motion.div
            key={item.label + i}
            initial={{ height: 0 }}
            animate={{ height: `${item.height}%` }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`w-3 rounded ${v.bar}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
        {data.map((item, i) => (
          <span key={item.label + i}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, color = "neutral" }) => (
  <div className="relative h-24">
    <svg viewBox="0 0 200 24" className="w-full h-full">
      <polyline
        points={data.map((d, i) => `${i * (200 / (data.length - 1))}, ${24 - d * 20}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={color === "neutral" ? "text-neutral-900 dark:text-neutral-100" : "text-blue-500"}
      />
    </svg>
  </div>
);

const Doughnut = ({ value = 48, max = 74 }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 36 36" aria-label={`${pct}%`}>
        <path
          className="text-neutral-200 dark:text-neutral-700"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="text-blue-500"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${pct}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {pct}%
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------- data ---------------------------------- */
// Mock data tailored to sidebar sections
const mockAdmins = [
  { name: "Li Ping Shen", email: "lisasweethome@yahoo.com", addedAt: "2025-10-30" },
  { name: "Rebecca P Y Chen", email: "chen.rebecca@gmail.com", addedAt: "2025-10-28" },
  { name: "Andre Yu Chi Au-Yeung", email: "andreauyeung@jovirealty.com", addedAt: "2025-10-02" },
];

const mockProperties = [
  { address: "1, asd123", type: "Residential", price: 123, offMarket: true, date: "2025-10-26" },
  { address: "Vancouver", type: "Land", price: 21312, offMarket: false, date: "2025-10-22" },
  { address: "Vancouver", type: "Residential", price: 213, offMarket: true, date: "2025-10-19" },
  { address: "Vancouver", type: "Residential Lease", price: 123, offMarket: false, date: "2025-10-18" },
];

const mockResources = [
  { title: "Sample Blog Title 1", kind: "Blog", status: "Draft", date: "2025-10-25" },
  { title: "Sample News Title 2", kind: "News", status: "Published", date: "2025-10-23" },
  { title: "Sample Podcast Title 4", kind: "Podcast", status: "Published", date: "2025-10-19" },
  { title: "Sample E‑book Title 3", kind: "E‑book", status: "Draft", date: "2025-10-21" },
];

// Inquiry is mock-only per requirement
const mockInquiries = [
  { name: "John Appleseed", subject: "Request showing – Vancouver", status: "In progress", date: "2025-10-26" },
  { name: "Maria Gomez", subject: "Financing question", status: "Completed", date: "2025-10-24" },
  { name: "Chen Wei", subject: "Schedule call", status: "In progress", date: "2025-10-23" },
  { name: "Alex Kim", subject: "Property details", status: "New", date: "2025-10-22" },
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("March 2025");
  const [selectedYear, setSelectedYear] = useState("2025");

  // Derived metrics
  const adminTotals = useMemo(
    () => ({
      total: 4, // from screenshot
      recentlyAdded: mockAdmins.length,
    }),
    []
  );

  const propertyTotals = useMemo(() => {
    const total = 7; // from screenshot
    const offMarket = mockProperties.filter((p) => p.offMarket).length;
    const recent = mockProperties.toSorted((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    return { total, offMarket, recent };
  }, []);

  const resourceTotals = useMemo(() => {
    const total = 45; // from screenshot tile
    const recent = mockResources.toSorted((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    return { total, recent };
  }, []);

  const inquiryTotals = useMemo(() => {
    const total = mockInquiries.length;
    const completed = mockInquiries.filter((i) => i.status === "Completed").length;
    const inProgress = mockInquiries.filter((i) => i.status === "In progress").length;
    const recent = mockInquiries.toSorted((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    return { total, completed, inProgress, recent };
  }, []);

  const barData = [
    { height: 40, label: "16/10" },
    { height: 80, label: "17/10" },
    { height: 100, label: "18/10" },
    { height: 60, label: "19/10" },
    { height: 90, label: "20/10" },
    { height: 70, label: "21/10" },
    { height: 50, label: "22/10" },
  ];

  return (
    <section className="p-4 md:p-6 space-y-6">
      {/* 1) Top stats aligned to sidebar entities */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3"
      >
        {/* <StatCard icon="👤" label="Administrators" value={adminTotals.total} sub={`+${adminTotals.recentlyAdded} recently`} color="gray" /> */}
        <StatCard icon="🧑‍💼" label="Agents" value="25" sub="+3 agents" color="indigo" />
        <StatCard icon="🏠" label="Properties" value="150" sub="All listings" color="blue" />
        <StatCard icon="📝" label="Off‑Market" value={propertyTotals.offMarket} sub="Total off‑market" color="teal" />
        <StatCard icon="📚" label="Resources" value={resourceTotals.total} sub="All content" color="yellow" />
        <StatCard icon="📞" label="Inquiries" value={inquiryTotals.total} sub="Mock" color="green" />
        <StatCard icon="🔗" label="Matrix Users" value="100" sub="Active" color="pink" />
        <StatCard icon="🛋️" label="Matrix Rooms" value="20" sub="Bookings" color="purple" />
      </motion.div>

      {/* 2) Feature sections that mirror the sidebar */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        {/* Administrators */}
        <SectionCard
          title="Administrators"
          description="Total agents and recently added."
          action={
            <a href="/admin/administrators" className="text-sm px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
              Manage
            </a>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Total Agents</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">25</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">+3 this month</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Recently Added</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                {adminTotals.recentlyAdded}
              </p>
              <a href="/admin/administrators/create" className="inline-block mt-2 text-xs font-medium text-blue-600 hover:underline">
                Create Agent
              </a>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
            {mockAdmins.map((a) => (
              <ListItem key={a.email} title={a.name} subtitle={a.email} right={a.addedAt} />
            ))}
          </ul>
        </SectionCard>

        {/* Property */}
        <SectionCard
          title="Property"
          description="Totals and latest listings."
          action={
            <a href="/admin/property" className="text-sm px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
              View All
            </a>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Total Listings</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{propertyTotals.total}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Off‑Market</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{propertyTotals.offMarket}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Create Listing</p>
              <a href="/admin/property/create" className="inline-block mt-2 text-xs font-medium text-blue-600 hover:underline">
                Add Property
              </a>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
            {propertyTotals.recent.map((p) => (
              <ListItem key={`${p.address}-${p.date}`} title={p.address} subtitle={`${p.type} · $${p.price.toLocaleString()}`} right={p.date} />
            ))}
          </ul>
        </SectionCard>

        {/* Resources */}
        <SectionCard
          title="Resources"
          description="Published & draft content."
          action={
            <a href="/admin/resources" className="text-sm px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
              Browse
            </a>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Total</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{resourceTotals.total}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Create</p>
              <a href="/admin/resources/create" className="inline-block mt-2 text-xs font-medium text-blue-600 hover:underline">
                New Resource
              </a>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Published</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">—</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Hook to API later</p>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
            {resourceTotals.recent.map((r) => (
              <ListItem key={`${r.title}-${r.date}`} title={r.title} subtitle={`${r.kind} · ${r.status}`} right={r.date} />
            ))}
          </ul>
        </SectionCard>

        {/* Inquiry (mock-only) */}
        <SectionCard
          title="Inquiry"
          description="Snapshot from mock data."
          action={
            <a href="/admin/inquiry" className="text-sm px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
              View Inquiries
            </a>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Total</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{inquiryTotals.total}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">Completed</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{inquiryTotals.completed}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-3">
              <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">In Progress</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{inquiryTotals.inProgress}</p>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
            {inquiryTotals.recent.map((q) => (
              <ListItem key={`${q.name}-${q.date}`} title={q.subject} subtitle={q.name} right={q.status} />
            ))}
          </ul>
        </SectionCard>
      </motion.div>

      {/* 3) Revenue widgets (kept, with headings) */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <section className="xl:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300">
                Revenue Updates
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Overview of Profit</p>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 dark:bg-neutral-800 dark:border-neutral-600"
            >
              <option>March 2025</option>
              <option>April 2025</option>
            </select>
          </div>
          <BarChart data={barData} color="blue" />
          <a
            href="/admin/reports"
            className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            View Full Report
          </a>
        </section>

        <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300 mb-3">
            Total Earnings
          </h3>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Earnings this month
              </span>
              <span className="font-semibold">$48,820</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Expense this month
              </span>
              <span className="font-semibold">$26,498</span>
            </div>
          </div>
          <Doughnut value={48} max={74} />
        </section>
      </motion.div>

      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300">
              Yearly Breakup
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 dark:bg-neutral-800 dark:border-neutral-600"
            >
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            $34,658
          </div>
          <Doughnut value={65} max={100} />
          <div className="flex justify-between text-xs mt-2">
            <span>Earnings</span>
            <span>Expenses</span>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300">
              Monthly Earnings
            </h3>
            <button className="text-sm text-blue-500">$</button>
          </div>
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            $6,820
          </div>
          <LineChart data={[0.2, 0.5, 0.8, 0.6, 0.9, 0.7]} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            ↑9% last year
          </p>
        </section>
      </motion.div>
    </section>
  );
}
