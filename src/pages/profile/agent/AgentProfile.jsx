// src/pages/dashboard/agent/profile/AgentProfile.jsx
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs';

// const agentData = {
//   id: 'ObjectId(68c253f5ecaa e00685de155)',
//   fullName: 'Rebecca P Y Chen',
//   mlsId: 'V10289',
//   email: 'chen.rebecca@gmail.com',
//   joviEmail: 'rebeccachen@jovirealty.com',
//   knownAs: 'Rebecca Chen',
//   licenseNumber: '19100',
//   licensedAs: 'Representative',
//   personalRealEstateCorporationName: 'Realtor®',
//   licenseFor: 'Trading',
//   officePhone: '604-202-2929',
//   phoneNumber: '778-835-7788',
//   aboutUs: 'Rebecca P Y Chen is a bilingual (English/Mandarin) residential REALTOR®.',
//   photoUrl: 'https://media-jovirealty.sfo3.cdn.digitaloceanspaces.com/Agents/AgentProfiles/aditya-tawatia', // Replace with actual
//   profileCreatedOn: '2023-05-15',
//   propertiesListed: {
//     offMarket: 15,
//     bridgeData: 28,
//   },
// };
const agentProfile = {
  image: 'https://media-jovirealty.sfo3.cdn.digitaloceanspaces.com/Agents/AgentProfiles/aditya-tawatia',
  name: 'John Doe',
  knownAs: 'John Doe',
  email: 'john.doe@jovi.com',
  phone: '+1 (555) 123-4567',
  officePhone: '604-202-2929',
  licenseNumber: 'LIC-123456',
  licensedAs: 'Representative',
  licenseFor: 'Trading',
  mlsId: 'V10289',
  aboutUs: 'Bilingual residential REALTOR® focused on client-first service and data-driven pricing.',
  profileCreatedOn: '2023-05-15',
  propertiesListed: { offMarket: 5, bridgeData: 12 },
};

function MailIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="m3 7 9 6 9-6"/></svg>);}
function PhoneIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.6a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.6.62A2 2 0 0 1 22 16.92Z"/></svg>);}
function IdIcon(props){return(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M13 8h5M13 12h5M13 16h5"/></svg>);}


export default function AgentProfile(){
  const navigate = useNavigate();
  const stats = [
    { label: 'Total Listings', value: 1200 },
    { label: 'Off‑Market', value: agentProfile.propertiesListed.offMarket },
    { label: 'Bridge Data', value: agentProfile.propertiesListed.bridgeData },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/agent/dashboard' }, { label: 'Profile' }]} />

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={agentProfile.image} alt={agentProfile.name} className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover shadow"/>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{agentProfile.name}</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{agentProfile.knownAs || agentProfile.name} • Profile created on {agentProfile.profileCreatedOn || '—'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs">Top Rated</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">Responsive</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={()=>navigate('/agent/dashboard')} className="rounded-lg bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Back to Dashboard</button>
              <button className="rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 px-5 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-750">Edit Profile</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"><MailIcon className="w-4 h-4"/>{agentProfile.email}</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"><PhoneIcon className="w-4 h-4"/>{agentProfile.phone}</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"><IdIcon className="w-4 h-4"/>License: {agentProfile.licenseNumber}</span>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">About Me</h2>
          <p className="text-neutral-700 dark:text-neutral-300">{agentProfile.aboutUs || '—'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"><MailIcon className="w-4 h-4"/>{agentProfile.email}</div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"><PhoneIcon className="w-4 h-4"/>{agentProfile.phone}</div>
              {agentProfile.officePhone && (
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"><PhoneIcon className="w-4 h-4"/>Office: {agentProfile.officePhone}</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">License Information</h3>
            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2"><IdIcon className="w-4 h-4"/>License Number: {agentProfile.licenseNumber}</div>
              {agentProfile.mlsId && <div className="flex items-center gap-2"><span className="w-4 h-4 grid place-content-center text-[11px] font-semibold border border-current rounded">MLS</span>MLS ID: {agentProfile.mlsId}</div>}
              {agentProfile.licensedAs && <div className="flex items-center gap-2">Licensed As: {agentProfile.licensedAs}</div>}
              {agentProfile.licenseFor && <div className="flex items-center gap-2">License For: {agentProfile.licenseFor}</div>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Property Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{s.value}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{s.label}</p>
                <div className="w-full h-2 mt-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(100, (s.value/1200)*100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}