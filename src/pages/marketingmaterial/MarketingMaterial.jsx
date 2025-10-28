import { useMemo, useState } from 'react';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import GalleryCard from '../../components/gallarycard/GalleryCard';
import { marketingTemplates } from '../../data/mockagents/marketingTemplates';

function SearchIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>);}  

const CATEGORIES = ['All','Social Posts','Flyers','Brand Kit'];
const SIZES = ['All','IG','FB','LinkedIn','TikTok'];
const SORTS = [
  { id: 'new', label: 'Newest' },
  { id: 'views', label: 'Most viewed' },
  { id: 'az', label: 'A → Z' },
];

export default function MarketingMaterial(){
  const [query,setQuery] = useState('');
  const [category,setCategory] = useState('All');
  const [size,setSize] = useState('All');
  const [sort,setSort] = useState('new');

  const filtered = useMemo(()=>{
    let rows = marketingTemplates.filter(t=>{
      const q = query.toLowerCase();
      const matchesQuery = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchesCat = category==='All' ? true : t.category===category;
      const matchesSize = size==='All' ? true : (t.sizes?.some(s=>s.includes(size)) || false);
      return matchesQuery && matchesCat && matchesSize;
    });
    switch (sort){
      case 'views': rows = [...rows].sort((a,b)=> (b.views||0)-(a.views||0)); break;
      case 'az': rows = [...rows].sort((a,b)=> a.title.localeCompare(b.title)); break;
      default: rows = [...rows].sort((a,b)=> new Date(b.uploadDate) - new Date(a.uploadDate));
    }
    return rows;
  },[query,category,size,sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <Breadcrumbs items={[{label:'Dashboard',to:'/agent/dashboard'},{label:'Marketing Material'}]} />

        {/* Header row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">Gallery</h1>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold">{filtered.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[220px]">
              <SearchIcon className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="Search Gallery"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-lg border border-neutral-300 bg-white py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500">
              {SORTS.map(s=> <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES.map(c=> (
            <button key={c} onClick={()=>setCategory(c)} className={`px-3 py-1.5 rounded-full text-sm border transition ${category===c? 'bg-blue-50 text-blue-700 border-blue-300':'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}>{c}</button>
          ))}
          <span className="mx-2 h-6 w-px bg-neutral-300"/>
          {SIZES.map(s=> (
            <button key={s} onClick={()=>setSize(s)} className={`px-3 py-1.5 rounded-full text-sm border transition ${size===s? 'bg-blue-50 text-blue-700 border-blue-300':'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}>{s}</button>
          ))}
        </div>

        {/* Grid: 3 cards per row on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <GalleryCard key={t.id} template={t} />
          ))}
        </div>

        {filtered.length===0 && (
          <div className="text-center py-16">
            <p className="text-neutral-600 text-lg mb-1">No templates found</p>
            <p className="text-neutral-500 text-sm">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}