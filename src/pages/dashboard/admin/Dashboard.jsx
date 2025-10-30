// src/pages/Dashboard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MetricCard = ({ icon, title, value, subtitle, color = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.02 }}
    className={`flex flex-col items-center p-4 rounded-xl border border-${color}-200 bg-${color}-50/50 dark:bg-${color}-900/20 dark:border-${color}-800/30`}
  >
    <div className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/50 flex items-center justify-center mb-2`}>
      {icon}
    </div>
    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{title}</h3>
    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">{value}</div>
    <p className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>
  </motion.div>
);

const BarChart = ({ data }) => (
  <div className="space-y-4">
    <div className="flex items-end justify-between h-24 space-x-1">
      {data.map((item, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${item.height}%` }}
          transition={{ delay: i * 0.1 }}
          className="w-3 bg-blue-500 rounded"
        />
      ))}
    </div>
    <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
      {data.map((item, i) => <span key={i}>{item.label}</span>)}
    </div>
  </div>
);

const DoughnutChart = ({ value, max, label }) => (
  <div className="relative w-32 h-32 mx-auto">
    <svg className="w-full h-full" viewBox="0 0 36 36">
      <path
        className="text-blue-500"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        strokeWidth="3"
        strokeDasharray={`${(value / max) * 100}, 100`}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  </div>
);

const LineChart = ({ data }) => (
  <div className="relative h-24">
    <svg viewBox="0 0 200 24" className="w-full h-full">
      <polyline
        points={data.map((d, i) => `${i * 40}, ${24 - d * 20}`).join(' ')}
        fill="none"
        stroke="blue"
        strokeWidth="2"
        className="stroke-current"
      />
    </svg>
  </div>
);

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('March 2025');
  const [selectedYear, setSelectedYear] = useState('2025');

  const metrics = [
    { icon: '🏠', title: 'Total Properties', value: '150', subtitle: '+12% this month', color: 'blue' },
    { icon: '👥', title: 'Agents', value: '25', subtitle: '+3 agents', color: 'indigo' },
    { icon: '📞', title: 'Inquiries', value: '300', subtitle: '+28% growth', color: 'green' },
    { icon: '👤', title: 'Customers', value: '500', subtitle: '+15 new', color: 'purple' },
    { icon: '📄', title: 'Resources', value: '45', subtitle: 'Published', color: 'yellow' },
    { icon: '🔗', title: 'Matrix Users', value: '100', subtitle: 'Active', color: 'pink' },
    { icon: '🛋️', title: 'Matrix Rooms', value: '20', subtitle: 'Bookings', color: 'teal' },
    { icon: '💼', title: 'Administrators', value: '4', subtitle: 'Total', color: 'gray' },
  ];

  const barData = [
    { height: 40, label: '16/10' },
    { height: 80, label: '17/10' },
    { height: 100, label: '18/10' },
    { height: 60, label: '19/10' },
    { height: 90, label: '20/10' },
    { height: 70, label: '21/10' },
    { height: 50, label: '22/10' },
  ];

  return (
    <section className="p-6 space-y-6">
      {/* Top Metrics Grid - Adapted from sidebar sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          />
        ))}
      </div>

      {/* Revenue Updates Section - Similar to ss2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview of Profit (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Revenue Updates</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Overview of Profit</p>
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
          <BarChart data={barData} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            View Full Report
          </motion.button>
        </motion.div>

        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Total Earnings</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Earnings this month</span>
              <span className="font-bold">$48,820</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Expense this month</span>
              <span className="font-bold">$26,498</span>
            </div>
          </div>
          <DoughnutChart value={48} max={74} label="$" />
        </motion.div>
      </div>

      {/* Yearly Breakup & Monthly Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Breakup (Pie-like Doughnut) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Yearly Breakup</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 dark:bg-neutral-800 dark:border-neutral-600"
            >
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">$34,658</div>
          <DoughnutChart value={65} max={100} label="↑9% last year" />
          <div className="flex justify-between text-xs mt-2">
            <span>Earnings</span>
            <span>Expenses</span>
          </div>
        </motion.div>

        {/* Monthly Earnings (Line Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Monthly Earnings</h3>
            <button className="text-sm text-blue-500">$</button>
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">$6,820</div>
          <LineChart data={[0.2, 0.5, 0.8, 0.6, 0.9, 0.7]} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">↑9% last year</p>
        </motion.div>
      </div>

      {/* Bottom Row: Quick Links or Additional Metrics - Grid for remaining sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center"
        >
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Inquiry Overview</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">300 active inquiries</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center"
        >
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Customer Insights</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">500 total customers, 85% satisfaction</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center"
        >
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Matrix Analytics</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">100 users, 20 rooms utilized</p>
        </motion.div>
      </div>
    </section>
  );
}