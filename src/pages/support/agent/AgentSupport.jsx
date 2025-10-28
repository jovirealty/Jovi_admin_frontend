// src/pages/support/agent/AgentSupport.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs';
import ContactButton from '../../../components/buttons/ContactButton';
import { agentSupportTickets } from '../../../data/mockagents/agentSupportStats';

export default function AgentSupport() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = agentSupportTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = agentSupportTickets.length;
  const pendingTickets = agentSupportTickets.filter(t => t.status === 'Pending').length;
  const openTickets = agentSupportTickets.filter(t => t.status === 'Open').length;
  const closedTickets = agentSupportTickets.filter(t => t.status === 'Closed').length;

  const statusColors = {
    Closed: 'bg-gray-100 text-gray-600',
    Pending: 'bg-yellow-100 text-yellow-800',
    Open: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Dashboard', to: '/agent/dashboard' },
          { label: 'Tickets' },
        ]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">Tickets</h1>
          </div>
          <Link
            to="/agent/support/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create New Incident
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
            <p className="text-xs text-blue-600 uppercase font-medium">Total Tickets</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{pendingTickets}</p>
            <p className="text-xs text-orange-600 uppercase font-medium">Pending Tickets</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{openTickets}</p>
            <p className="text-xs text-green-600 uppercase font-medium">Open Tickets</p>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">{closedTickets}</p>
            <p className="text-xs text-pink-600 uppercase font-medium">Closed Tickets</p>
          </div>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{ticket.title}</div>
                        <div className="text-sm text-neutral-500">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-neutral-600">{ticket.assignedTo.charAt(0)}</span>
                        </div>
                        <div className="text-sm font-medium text-neutral-900">{ticket.assignedTo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{ticket.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-neutral-400 hover:text-neutral-600">
                        view progress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Quick Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactButton
              icon="📧"
              label="Email Support"
              action="support@jovirealty.com"
              type="email"
            />
            <ContactButton
              icon="📞"
              label="Call Us"
              action="+1 (555) 0123"
              type="phone"
            />
            <ContactButton
              icon="💬"
              label="WhatsApp Chat"
              action="Message us instantly"
              type="whatsapp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}