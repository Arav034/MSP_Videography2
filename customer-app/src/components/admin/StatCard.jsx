import { Upload, Calendar, Mail, ArrowBigUp} from "lucide-react";

const iconMap = {
  Upload,
  Calendar,
  Mail,
  ArrowBigUp,
};

export default function StatCard({ title, value, trend, icon }) {
  const IconComponent = iconMap[icon];

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-charcoal mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{trend}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <IconComponent size={24} className="text-msp-blue" />
        </div>
      </div>
    </div>
  );
}