// src/components/ticketCard/TicketCard.jsx
import { StatBadge } from "../badge/StatBadge"; 

const statusToColor = {
  New: 'inProgress',
  'In Progress': 'active',
  Resolved: 'resolved',
};

export default function TicketCard({ ticket }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">{ticket.title}</h4>
        <StatBadge label="Status" value={ticket.status} color={statusToColor[ticket.status] || 'total'} />
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{ticket.description}</p>
      <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
        <span>{ticket.category}</span>
        <span>{new Date(ticket.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}