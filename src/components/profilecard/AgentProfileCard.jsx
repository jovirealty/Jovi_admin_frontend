import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { agentProfile } from '../../data/mockagents/agentProfile';


function MailIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="m3 7 9 6 9-6" /></svg>
    )
}
function PhoneIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.6a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.6.62A2 2 0 0 1 22 16.92Z" /></svg>
    )
}
function IdIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="12" r="2.5" /><path d="M13 8h5M13 12h5M13 16h5" /></svg>
    )
}


function Chip({ icon, children }) {
    return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300">
            {icon}
            <span className="truncate max-w-[220px]">{children}</span>
        </span>
    );
}


export default function AgentProfileCard() {
    return (
        <motion.div
            className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 dark:from-neutral-800 dark:via-neutral-850 dark:to-neutral-900 p-6 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={agentProfile.image}
                        alt={agentProfile.name}
                        className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover shadow"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Hey, {agentProfile.name}</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Let’s win the day. 📈</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Chip icon={<MailIcon className="w-4 h-4" />}>{agentProfile.email}</Chip>
                    <Chip icon={<PhoneIcon className="w-4 h-4" />}>{agentProfile.phone}</Chip>
                    <Chip icon={<IdIcon className="w-4 h-4" />}>License: {agentProfile.licenseNumber}</Chip>
                </div>
                <Link
                    to="/agent/profile"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    View Profile
                </Link>
            </div>
        </motion.div>
    );
}