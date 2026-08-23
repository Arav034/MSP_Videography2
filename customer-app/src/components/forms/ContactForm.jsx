import { useState } from "react";
import { Check } from "lucide-react";
import TextField from "@/components/forms/TextField";
import TextArea from "@/components/forms/TextArea";
import Spinner from "@/components/common/Spinner";
import { createContact } from "@/services/contactform";

const INITIAL_STATE = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   // No backend wired yet — simulated delay to demonstrate the loading state.
  //   setTimeout(() => {
  //     console.log("Contact form submitted:", form);
  //     setSubmitting(false);
  //     setSubmitted(true);
  //     setForm(INITIAL_STATE);
  //   }, 900);
  // };

  const isPhoneValid = form.phone.replace(/\D/g, "").length === 10;
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const contactData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        status: "New",
        admin_notes: null,
      };

      console.log("Contact Data:", contactData);

      await createContact(contactData);

      setSubmitted(true);
      setForm(INITIAL_STATE);
    } catch (error) {
      console.error("Contact submission failed:", error);
      alert("Failed to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="border border-mist bg-white p-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-5">
          <Check size={24} />
        </div>
        <h3 className="font-display text-2xl mb-2">Message sent</h3>
        <p className="text-steel max-w-sm">
          Thanks for reaching out — our team will get back to you within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-ghost mt-8"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-mist bg-white p-8 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <TextField
          label="Phone"
          name="phone"
          type="number"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          required />
          
          {form.phone && form.phone.replace(/\D/g, "").length < 10 && (
          <p className="mt-2 text-xs text-red-500">
            Please enter your full 10-digit phone number.
          </p>
        )}
      
          {form.phone && form.phone.replace(/\D/g, "").length > 10 && (
          <p className="mt-2 text-xs text-red-500">
            Phone number cannot be more than 10 digits.
          </p>
      )}
      </div>
      
      <TextField label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
      <TextArea label="Message (optional)" name="message" rows={6} value={form.message} onChange={handleChange} />

     <button
        type="submit"
        disabled={submitting || !isPhoneValid}
        className="btn-primary self-start mt-2 disabled:opacity-70 rounded-lg"
      >
        {submitting ? <Spinner /> : null}
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}