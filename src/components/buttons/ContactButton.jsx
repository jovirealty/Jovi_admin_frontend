// src/components/buttons/ContactButton.jsx
export default function ContactButton({ icon, label, action, type }) {
  const handleClick = () => {
    if (type === 'email') {
      window.location.href = `mailto:support@jovirealty.com?subject=${encodeURIComponent(label)}&body=Please describe your issue here.`;
    } else if (type === 'phone') {
      window.location.href = 'tel:+1-555-0123';
    } else if (type === 'whatsapp') {
      window.open('https://wa.me/15550123?text=' + encodeURIComponent(`Hi, I need support with: ${label}`), '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow w-full text-left"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{action}</p>
      </div>
    </button>
  );
}