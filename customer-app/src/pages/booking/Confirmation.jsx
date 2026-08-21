import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function Confirmation({ service, total }) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
        <Check size={28} />
      </div>
      <h2 className="font-display text-3xl mb-4">Booking request sent</h2>
      <p className="text-steel max-w-md mx-auto mb-10">
        We've received your request for{" "}
        <span className="text-ink">{service?.title}</span>. Our team will
        confirm your session shortly.
      </p>
      {/* {typeof total === "number" && (
        <p className="text-black max-w-md mx-auto text-lg mb-10">
         "Admin will contact you to confirm the final price."
        </p>
      )} */}
      <Link to={ROUTES.HOME} className="btn-primary">
        Back To Home
      </Link>
    </div>
  );
}