import { useNavigate } from 'react-router-dom';
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-white border-t border-gray-100">

      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row justify-between gap-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">

            <span className="text-2xl font-semibold text-[#0b1220]">
              Dragend
            </span>
          </div>
          <p className="text-gray-500 leading-relaxed">
            Dragend is a visual backend builder that lets developers design,
            deploy, and scale backends using drag-and-drop workflows — without
            sacrificing control.
          </p>
        </div>

        <div className="flex gap-24">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-[#0b1220]">
              <li onClick={() => navigate('/contact')} className="cursor-pointer hover:text-purple-600 transition">
                Contact Us
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">

          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-gray-600 transition">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-gray-600 transition">
              Terms of Use
            </span>
          </div>

          <div>
            © {new Date().getFullYear()} Dragend
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
