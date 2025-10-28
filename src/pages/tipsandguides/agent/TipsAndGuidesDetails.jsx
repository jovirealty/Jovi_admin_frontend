// src/pages/tipsandguides/agent/TipsAndGuidesDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs';
import { tipsAndGuidesData } from '../../../data/mockagents/tipsAndGuides';

export default function TipsAndGuidesDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const foundItem = tipsAndGuidesData.find(data => data.id === parseInt(id));
    setItem(foundItem);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <p className="text-neutral-600 dark:text-neutral-400">Resource not found.</p>
      </div>
    );
  }

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${item.title}.${fileUrl.split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Dashboard', to: '/agent/dashboard' },
          { label: 'Tips & Guides', to: '/agent/tipsandguides' },
          { label: item.title },
        ]} />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{item.title}</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.duration && <span className="text-sm text-neutral-500 dark:text-neutral-400">{item.duration}</span>}
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                {item.type}
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-64 object-cover rounded-lg shadow-sm"
          />

          {/* Description and Tags */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Description</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Full Content or Embed */}
          {item.fullContent && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Full Article</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{item.fullContent}</p>
              </div>
            </div>
          )}

          {item.embedUrl && (item.type === 'Video' || item.type === 'Podcast') && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {item.type} Player
              </h2>
              {item.type === 'Video' ? (
                <iframe
                  src={item.embedUrl}
                  className="w-full h-64 rounded-lg"
                  allowFullScreen
                />
              ) : (
                <audio controls className="w-full">
                  <source src={item.embedUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {/* Download/Action Section */}
          {(item.fileUrl || item.embedUrl) && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {item.fileUrl && (
                  <button
                    onClick={() => handleDownload(item.fileUrl)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Download {item.type}
                  </button>
                )}
                {item.embedUrl && item.type === 'Podcast' && (
                  <a
                    href={item.embedUrl}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                  >
                    Play in New Tab
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}