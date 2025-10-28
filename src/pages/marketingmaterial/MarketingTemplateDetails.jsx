import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { marketingTemplates } from '../../data/mockagents/marketingTemplates';

function DownloadIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>);}
function BackIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M15 18l-6-6 6-6"/></svg>);}

export default function MarketingTemplateDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const template = marketingTemplates.find(t=> t.id === Number(id));
  const [selected, setSelected] = useState(template?.formats?.[0]?.format || template?.format);

  const related = useMemo(()=> marketingTemplates.filter(t=> t.category===template?.category && t.id!==template?.id).slice(0,4), [template]);

  if(!template){
    return (
      <div className="min-h-screen grid place-content-center bg-gray-50 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Template not found</h2>
          <button onClick={()=>navigate('/agent/marketing-material')} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><BackIcon className="w-4 h-4"/> Back to Gallery</button>
        </div>
      </div>
    );
  }

  const selectedFile = (template.formats||[]).find(f=>f.format===selected) || { format: template.format, fileUrl: template.fileUrl, size: template.size };

  const onDownload = ()=> {
    const a = document.createElement('a');
    a.href = selectedFile.fileUrl;
    a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
        <Breadcrumbs items={[{label:'Dashboard',to:'/agent/dashboard'},{label:'Marketing Material',to:'/agent/marketing-material'},{label: template.title}]} />

        {/* Top back button (under breadcrumbs) */}
        <button onClick={()=>navigate('/agent/marketing-material')} className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800">
          <BackIcon className="w-4 h-4"/> Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-4 md:p-6">
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden shadow-sm">
                <img src={template.previewUrl} alt={template.title} className="w-full h-[420px] object-contain bg-neutral-100" />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 mb-1">{template.title}</h1>
                  <p className="text-neutral-600 mb-3">{template.description}</p>
                  <dl className="text-sm text-neutral-600 space-y-1">
                    <div><dt className="inline font-medium text-neutral-800">Category:</dt> <dd className="inline">{template.category}</dd></div>
                    <div><dt className="inline font-medium text-neutral-800">Uploaded:</dt> <dd className="inline">{template.uploadDate}</dd></div>
                    <div><dt className="inline font-medium text-neutral-800">Views:</dt> <dd className="inline">{template.views}</dd></div>
                    <div><dt className="inline font-medium text-neutral-800">Size:</dt> <dd className="inline">{selectedFile.size}</dd></div>
                    {template.sizes && (<div><dt className="inline font-medium text-neutral-800">Supported Sizes:</dt> <dd className="inline">{template.sizes.join(', ')}</dd></div>)}
                  </dl>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Download options</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {(template.formats?.length? template.formats : [{ format: template.format, fileUrl: template.fileUrl, size: template.size }]).map(opt=> (
                      <button
                        key={opt.format}
                        onClick={()=> setSelected(opt.format)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${selected===opt.format? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                      >
                        <span>{opt.format} ({opt.size})</span>
                        <DownloadIcon className="w-4 h-4"/>
                      </button>
                    ))}
                  </div>
                  <button onClick={onDownload} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700">
                    <DownloadIcon className="w-4 h-4"/> Download {selected}
                  </button>

                  {template.canvaUrl && (
                    <a href={template.canvaUrl} target="_blank" rel="noreferrer" className="mt-2 w-full inline-flex items-center justify-center rounded-lg border border-blue-200 text-blue-700 py-2.5 hover:bg-blue-50">Open in Canva</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-1">What agents get</h4>
                <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                  <li>Brand‑approved templates</li>
                  <li>Social (IG/FB/LinkedIn/TikTok)</li>
                  <li>Flyers (Open House / Just Listed / Sold)</li>
                  <li>Brand kit (logos, colors, fonts)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-1">How agents use it</h4>
                <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                  <li>Preview the template</li>
                  <li>Select a format/size</li>
                  <li>Download and use in your channel</li>
                  <li className="text-neutral-500">Optional later: quick text swap / Canva link</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-1">Done when</h4>
                <p className="text-sm text-neutral-700">Agents can find, preview, and download the right files quickly.</p>
              </div>
            </div>

            {related.length>0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Related in {template.category}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {related.map(r=> (
                    <a key={r.id} href={`/agent/marketing-material/${r.id}`} className="block rounded-xl overflow-hidden bg-white border border-neutral-200 hover:shadow-sm">
                      <img src={r.previewUrl} alt={r.title} className="h-28 w-full object-cover bg-neutral-100"/>
                      <div className="px-2.5 py-2">
                        <div className="text-[13px] font-medium line-clamp-1 text-neutral-900">{r.title}</div>
                        <div className="text-[12px] text-neutral-500 line-clamp-1">{r.uploadDate}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}