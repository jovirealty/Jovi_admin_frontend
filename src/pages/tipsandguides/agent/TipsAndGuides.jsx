// Updated src/pages/tipsandguides/agent/TipsAndGuides.jsx (import ContentCard with correct path)
import { useState } from 'react';
import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs';
import ContentCard from '../../../components/contentCard/ContentCard';
import { tipsAndGuidesData } from '../../../data/mockagents/tipsAndGuides';

export default function TipsAndGuides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);

  const types = ['All', 'PDF', 'Article', 'Podcast', 'Video'];
  const allTags = [...new Set(tipsAndGuidesData.flatMap(item => item.tags))];

  const filteredData = tipsAndGuidesData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
    return matchesSearch && matchesType && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Dashboard', to: '/agent/dashboard' },
          { label: 'Tips & Guides' },
        ]} />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tips & Guides Library</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Access exclusive resources to boost your real estate expertise.</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <ContentCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">No resources found matching your filters.</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-500">Total resources: {tipsAndGuidesData.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}