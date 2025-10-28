import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

function DotsIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>);}
function FileIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h6"/></svg>);}

export default function GalleryCard({ template }){
  const navigate = useNavigate();
  const [open,setOpen] = useState(false);

  const color = useMemo(()=>{
    const f = (template.format||'').toUpperCase();
    if(['PDF'].includes(f)) return { chip:'bg-red-50 text-red-700 border-red-200', icon:'text-red-600' };
    if(['PNG'].includes(f)) return { chip:'bg-green-50 text-green-700 border-green-200', icon:'text-green-600' };
    if(['JPG','JPEG'].includes(f)) return { chip:'bg-amber-50 text-amber-700 border-amber-200', icon:'text-amber-600' };
    if(['PSD'].includes(f)) return { chip:'bg-violet-50 text-violet-700 border-violet-200', icon:'text-violet-600' };
    if(['AI','INDD'].includes(f)) return { chip:'bg-blue-50 text-blue-700 border-blue-200', icon:'text-blue-600' };
    return { chip:'bg-neutral-100 text-neutral-700 border-neutral-200', icon:'text-neutral-600' };
  },[template.format]);

  const firstDownload = (template.formats?.[0]?.fileUrl) || template.fileUrl;

  const handleDownload = (e)=>{
    e.preventDefault();
    const a = document.createElement('a');
    a.href = firstDownload;
    a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
    setOpen(false);
  };
  const handleCopy = async (e)=>{
    e.preventDefault();
    const url = `${location.origin}/agent/marketing-material/${template.id}`;
    await navigator.clipboard.writeText(url);
    setOpen(false);
  };
  const handlePreview = (e)=>{ e.preventDefault(); navigate(`/agent/marketing-material/${template.id}`); };

  return (
    <Link to={`/agent/marketing-material/${template.id}`} className="group block rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 relative">
      <div className="relative">
        <img src={template.previewUrl} alt={template.title} className="h-44 w-full object-cover object-center bg-neutral-100" loading="lazy" />
        <div className="absolute top-3 right-3">
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/95 backdrop-blur border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-white shadow-sm"
            onClick={(e)=>{e.preventDefault(); setOpen(v=>!v);}}
            aria-label="More options"
          >
            <DotsIcon className="w-4 h-4"/>
          </button>
        </div>
        {open && (
          <div className="absolute top-12 right-3 z-10 w-40 rounded-lg border border-neutral-200 bg-white shadow-md p-1 text-sm">
            <button onClick={handlePreview} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-50">Preview</button>
            <button onClick={handleDownload} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-50">Download</button>
            <button onClick={handleCopy} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-50">Copy link</button>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${color.chip}`}>
            <FileIcon className={`w-3.5 h-3.5 ${color.icon}`} />
            {template.format}
          </span>
          <span className="inline-block text-neutral-500">{template.uploadDate}</span>
        </div>
        <div className="text-neutral-900 font-medium leading-tight line-clamp-1 mb-0.5">{template.title}</div>
        <div className="text-neutral-500 text-sm line-clamp-1">{template.category}</div>
      </div>
    </Link>
  );
}