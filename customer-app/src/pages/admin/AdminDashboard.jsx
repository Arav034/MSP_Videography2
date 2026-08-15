import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase/supabaseClient";
import StatCard from "@/components/admin/StatCard";
// import DataTable from "@/components/admin/DataTable";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalBookings: 0,
    totalContacts: 0,
    pendingUploads: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch uploads
      const { data: uploadsData, error: uploadsError } = await supabase
        .from("uploads")
        .select("*", { count: "exact" });

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*", { count: "exact" });

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*", { count: "exact" });

      if (!uploadsError && !bookingsError && !contactsError) {
        setStats({
          totalUploads: uploadsData?.length || 0,
          totalBookings: bookingsData?.length || 0,
          totalContacts: contactsData?.length || 0,
          pendingUploads: uploadsData?.filter(
            (u) => u.upload_status === "Waiting"
          ).length || 0,
        });

        setRecentUploads(uploadsData?.slice(0, 5) || []);
        setRecentBookings(bookingsData?.slice(0, 5) || []);
        setRecentContacts(contactsData?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Uploads"
          value={stats.totalUploads}
          trend="+12% this month"
          icon="Upload"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          trend="+8% this month"
          icon="Calendar"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          trend="+5% this month"
          icon="Mail"
        />
        <StatCard
          title="Pending Uploads"
          value={stats.pendingUploads}
          trend="Requires attention"
          icon="AlertCircle"
        />
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Recent Uploads
          </h2>
          {recentUploads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Upload #
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((upload) => (
                    <tr
                      key={upload.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 font-medium text-charcoal">
                        {upload.upload_number}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {upload.customer_name}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            upload.upload_status === "Waiting"
                              ? "bg-yellow-100 text-yellow-800"
                              : upload.upload_status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {upload.upload_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No uploads yet</p>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Recent Bookings
          </h2>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Booking #
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 font-medium text-charcoal">
                        {booking.booking_number}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {booking.customer_name}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.booking_status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.booking_status === "Confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          )}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-charcoal mb-4">
          Recent Contacts
        </h2>
        {recentContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 font-medium text-charcoal">
                      {contact.name}
                    </td>
                    <td className="py-3 px-2 text-gray-600 text-xs">
                      {contact.email}
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {contact.subject}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No contacts yet</p>
        )}
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { supabase } from "@/services/supabase/supabaseClient";
// import StatCard from "@/components/admin/StatCard";
// import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalUploads: 0,
//     totalBookings: 0,
//     totalContacts: 0,
//     pendingUploads: 0,
//   });
//   const [recentUploads, setRecentUploads] = useState([]);
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [recentContacts, setRecentContacts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setIsLoading(true);

//       // Fetch uploads
//       const { data: uploadsData, error: uploadsError } = await supabase
//         .from("uploads")
//         .select("*", { count: "exact" });

//       // Fetch bookings
//       const { data: bookingsData, error: bookingsError } = await supabase
//         .from("bookings")
//         .select("*", { count: "exact" });

//       // Fetch contacts
//       const { data: contactsData, error: contactsError } = await supabase
//         .from("contacts")
//         .select("*", { count: "exact" });

//       if (!uploadsError && !bookingsError && !contactsError) {
//         setStats({
//           totalUploads: uploadsData?.length || 0,
//           totalBookings: bookingsData?.length || 0,
//           totalContacts: contactsData?.length || 0,
//           pendingUploads: uploadsData?.filter(
//             (u) => u.upload_status === "Waiting"
//           ).length || 0,
//         });

//         setRecentUploads(uploadsData?.slice(0, 5) || []);
//         setRecentBookings(bookingsData?.slice(0, 5) || []);
//         setRecentContacts(contactsData?.slice(0, 5) || []);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Uploads"
//           value={stats.totalUploads}
//           trend="+12% this month"
//           icon="Upload"
//         />
//         <StatCard
//           title="Total Bookings"
//           value={stats.totalBookings}
//           trend="+8% this month"
//           icon="Calendar"
//         />
//         <StatCard
//           title="Total Contacts"
//           value={stats.totalContacts}
//           trend="+5% this month"
//           icon="Mail"
//         />
//         <StatCard
//           title="Pending Uploads"
//           value={stats.pendingUploads}
//           trend="Requires attention"
//           icon="AlertCircle"
//         />
//       </div>

//       {/* Recent Data Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Uploads */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-bold text-charcoal mb-4">
//             Recent Uploads
//           </h2>
//           {recentUploads.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="border-b border-gray-200">
//                   <tr>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Upload #
//                     </th>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Customer
//                     </th>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentUploads.map((upload) => (
//                     <tr
//                       key={upload.id}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="py-3 px-2 font-medium text-charcoal">
//                         {upload.upload_number}
//                       </td>
//                       <td className="py-3 px-2 text-gray-600">
//                         {upload.customer_name}
//                       </td>
//                       <td className="py-3 px-2">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             upload.upload_status === "Waiting"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : upload.upload_status === "Processing"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {upload.upload_status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center py-8">No uploads yet</p>
//           )}
//         </div>

//         {/* Recent Bookings */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-bold text-charcoal mb-4">
//             Recent Bookings
//           </h2>
//           {recentBookings.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="border-b border-gray-200">
//                   <tr>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Booking #
//                     </th>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Customer
//                     </th>
//                     <th className="text-left py-2 px-2 font-medium text-gray-600">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentBookings.map((booking) => (
//                     <tr
//                       key={booking.id}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="py-3 px-2 font-medium text-charcoal">
//                         {booking.booking_number}
//                       </td>
//                       <td className="py-3 px-2 text-gray-600">
//                         {booking.customer_name}
//                       </td>
//                       <td className="py-3 px-2">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             booking.booking_status === "Pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : booking.booking_status === "Confirmed"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {booking.booking_status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center py-8">No bookings yet</p>
//           )}
//         </div>
//       </div>

//       {/* Recent Contacts */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-bold text-charcoal mb-4">
//           Recent Contacts
//         </h2>
//         {recentContacts.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="border-b border-gray-200">
//                 <tr>
//                   <th className="text-left py-2 px-2 font-medium text-gray-600">
//                     Name
//                   </th>
//                   <th className="text-left py-2 px-2 font-medium text-gray-600">
//                     Email
//                   </th>
//                   <th className="text-left py-2 px-2 font-medium text-gray-600">
//                     Subject
//                   </th>
//                   <th className="text-left py-2 px-2 font-medium text-gray-600">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentContacts.map((contact) => (
//                   <tr
//                     key={contact.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="py-3 px-2 font-medium text-charcoal">
//                       {contact.name}
//                     </td>
//                     <td className="py-3 px-2 text-gray-600 text-xs">
//                       {contact.email}
//                     </td>
//                     <td className="py-3 px-2 text-gray-600">
//                       {contact.subject}
//                     </td>
//                     <td className="py-3 px-2">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           contact.status === "New"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {contact.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-8">No contacts yet</p>
//         )}
//       </div>
//     </div>
//   );
// }