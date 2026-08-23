import { Link } from "react-router-dom";
import {
  Film,
  MapPin,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function Footer() {
  return (
   <footer className="bg-ink text-frost">

  {/* Main Footer */}
  <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">

      {/* =========================================
          COLUMN 1 — BRAND
      ========================================= */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-semibold text-white">
            MSP VIDEOGRAPHY
          </span>
        </div>

        <p className="text-sm leading-6 text-frost/70 max-w-md">
          An independent creative videography studio specializing
          in high-end cinematography, commercial editing,
          color grading, and multi-cam broadcast production.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3 mt-8">

          {/* Instagram */}
          {/* <a
            href="#"
            aria-label="Instagram"
            className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-frost/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="0.8"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a> */}

          {/* YouTube */}
          {/* <a
            href="#"
            aria-label="YouTube"
            className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-frost/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12s0-4-1-5-2-1-4-1H8C6 6 4 6 3 7s-1 5-1 5 0 4 1 5 2 1 4 1h8c2 0 3 0 4-1s1-5 1-5Z" />
              <path d="m10 9 5 3-5 3V9Z" />
            </svg>
          </a> */}

          {/* LinkedIn */}
          {/* <a
            href="#"
            aria-label="LinkedIn"
            className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-frost/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 10v6" />
              <path d="M8 7.5v.01" />
              <path d="M12 16v-3.2a2.2 2.2 0 0 1 4.4 0V16" />
              <path d="M12 10v6" />
            </svg>
          </a> */}

        </div>
      </div>


      {/* =========================================
          COLUMN 2 — QUICK LINKS
      ========================================= */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-white mb-5">
          Quick Links
        </h3>

        <ul className="space-y-3 text-sm text-frost/70">

          <li>
            <Link
              to={ROUTES.PORTFOLIO}
              className="hover:text-white transition-colors"
            >
              Selected Portfolio
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.SERVICES}
              className="hover:text-white transition-colors"
            >
              Production Services
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.UPLOAD}
              className="hover:text-white transition-colors"
            >
              Upload for Editing
            </Link>
          </li>

          <li>
            <a
              href="/#Process"
              className="hover:text-white transition-colors"
            >
              Studio Process
            </a>
          </li>

          <li>
            <Link
              to={ROUTES.FAQ}
              className="hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </li>

        </ul>
      </div>


      {/* =========================================
          COLUMN 3 — STUDIO HQ
      ========================================= */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-white mb-5">
          Studio HQ
        </h3>

        <div className="space-y-4 text-sm text-frost/70">

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin
              size={19}
              strokeWidth={1.8}
              className="text-blue-500 shrink-0 mt-0.5"
            />

            <p>
              10/10E, Vengatesh nagar,
              <br />
              Melur, Madurai District,
              <br />
              Tamil Nadu - 625106,
              <br />
              India.
            </p>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail
              size={19}
              strokeWidth={1.8}
              className="text-blue-500 shrink-0"
            />

            <a
              href="mailto:book@mspvideography.com"
              className="hover:text-white transition-colors"
            >
            mspvideograph@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone
              size={19}
              strokeWidth={1.8}
              className="text-blue-500 shrink-0"
            />

            <a
              href="tel:+919876543210"
              className="hover:text-white transition-colors"
            >
              +91 8838346319
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>


  {/* Bottom Bar */}
  <div className="border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between font-mono text-xs text-frost/50">

      <span>
        © {new Date().getFullYear()} MSP VIDEOGRAPHY
      </span>

      <span>
        BUILT BY ARAVINTH
      </span>

    </div>
  </div>

</footer>
  );
}




