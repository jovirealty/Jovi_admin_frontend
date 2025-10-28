// src/pages/support/agent/NewSupportTicket.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs';

export default function NewSupportTicket() {
  const [formData, setFormData] = useState({
    category: '',
    message: '',
    file: null,
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const categories = ['Billing', 'Technical Issue', 'General Inquiry'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission - in real app, this would create a ticket
    console.log('New ticket submitted:', formData);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      navigate('/agent/agent-support');
    }, 3000);
    // Reset form
    setFormData({ category: '', message: '', file: null });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Dashboard', to: '/agent/dashboard' },
          { label: 'Tickets', to: '/agent/agent-support' },
          { label: 'New Ticket' },
        ]} />

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Create a New Ticket</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue..."
                rows={4}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Attach File (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() => navigate('/agent/agent-support')}
                className="flex-1 bg-gray-300 text-neutral-900 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
            {submitSuccess && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center">Ticket created successfully! Redirecting...</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}