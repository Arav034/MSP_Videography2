import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase/supabaseClient";
import SearchBar from "@/components/admin/SearchBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import ContactDetailsDrawer from "@/components/admin/ContactDetailsDrawer";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import AdminPasswordModal from "@/components/admin/AdminPasswordModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Trash2, Eye } from "lucide-react";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Drawer states
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    contactId: null,
    contact: null,
  });
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    action: null,
    contactId: null,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.subject.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredContacts(filtered);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDrawer(true);
  };

  const handleDeleteClick = (contact) => {
    setDeleteModal({
      show: true,
      contactId: contact.id,
      contact: contact,
    });
  };

  const handleConfirmDelete = () => {
    setDeleteModal({ show: false, contactId: null, contact: null });
    setPasswordModal({
      show: true,
      action: "delete",
      contactId: deleteModal.contactId,
    });
  };

  const handlePasswordVerified = async () => {
    if (passwordModal.action === "delete") {
      try {
        const { error } = await supabase
          .from("contacts")
          .delete()
          .eq("id", passwordModal.contactId);

        if (error) throw error;

        setPasswordModal({ show: false, action: null, contactId: null });
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleMarkAsRead = async (contact) => {
    if (contact.status === "Read") return;

    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: "Read" })
        .eq("id", contact.id);

      if (error) throw error;
      fetchContacts();
      setShowDrawer(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = {
    total: contacts.length,
    unread: contacts.filter((c) => c.status === "New").length,
    read: contacts.filter((c) => c.status === "Read").length,
    today: contacts.filter((c) => {
      const contactDate = new Date(c.created_at).toDateString();
      const today = new Date().toDateString();
      return contactDate === today;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal">
          Contact Messages
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          View and manage customer enquiries.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Messages", value: stats.total },
          { label: "Unread", value: stats.unread },
          { label: "Read", value: stats.read },
          { label: "Today", value: stats.today },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-charcoal mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="w-full sm:w-48">
          <FilterDropdown
            label="Status"
            options={["All", "New", "Read"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Preview
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-charcoal text-sm">
                        {contact.name}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm truncate">
                        {contact.email}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {contact.phone || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm truncate max-w-xs">
                        {contact.subject}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm truncate max-w-xs">
                        {contact.message}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          contact.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-msp-blue rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contact)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No contact messages found.</p>
          </div>
        )}
      </div>

      {/* Contact Details Drawer */}
      {selectedContact && (
        <ContactDetailsDrawer
          contact={selectedContact}
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          onMarkAsRead={() => handleMarkAsRead(selectedContact)}
          onDelete={() => {
            setShowDrawer(false);
            handleDeleteClick(selectedContact);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <ConfirmDeleteModal
          title="Delete Contact Message?"
          message={`This will permanently delete the message from ${deleteModal.contact?.name}.`}
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setDeleteModal({ show: false, contactId: null, contact: null })
          }
        />
      )}

      {/* Password Verification Modal */}
      {passwordModal.show && (
        <AdminPasswordModal
          action={`Delete message from ${deleteModal.contact?.name}`}
          onVerified={handlePasswordVerified}
          onCancel={() =>
            setPasswordModal({ show: false, action: null, contactId: null })
          }
        />
      )}
    </div>
  );
}