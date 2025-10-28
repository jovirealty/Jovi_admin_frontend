export function StatBadge({ label, value, color = 'neutral' }) {
  const colorClasses = {
    active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    resolved: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    inProgress: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    total: 'bg-gray-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
  };

  return (
    <div className={`p-3 rounded-lg text-center ${colorClasses[color] || colorClasses.total}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase font-medium">{label}</p>
    </div>
  );
}