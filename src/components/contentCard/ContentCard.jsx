// src/components/dashboard/agent/ContentCard.jsx
import { Link } from 'react-router-dom';

const typeIcons = {
  PDF: '📄',
  Article: '📖',
  Podcast: '🎧',
  Video: '🎥',
};

export default function ContentCard({ item }) {
  return (
    <Link to={`/agent/tipsandguides/${item.id}`} className="block">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
              {typeIcons[item.type]} {item.type}
            </span>
            {item.duration && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.duration}</span>
            )}
          </div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>{new Date(item.date).toLocaleDateString()}</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}