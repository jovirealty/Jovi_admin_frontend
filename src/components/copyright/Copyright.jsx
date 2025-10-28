import { Link } from 'react-router-dom';

export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mx-auto mt-8 max-w-6xl flex flex-col sm:flex-row justify-between items-center text-center text-xs text-gray-500 space-y-2 sm:space-y-0">
      <div className="flex items-center justify-center">
        <span>&copy; {currentYear} Jovi Realty. All rights reserved.</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        <Link
          to="/agent/terms"
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium"
        >
          Terms & Conditions
        </Link>
        <Link
          to="/agent/privacy"
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}