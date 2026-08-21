import { useState } from "react";
import StepIndicator from "@/components/common/StepIndicator";
import ServiceStep from "@/pages/booking/ServiceStep";
import DateTimeStep from "@/pages/booking/DateTimeStep";
import DetailsStep from "@/pages/booking/DetailsStep";
import ReviewStep from "@/pages/booking/ReviewStep";
import Confirmation from "@/pages/booking/Confirmation";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import SEO from "@/components/common/SEO";
import { createBooking } from "@/services/bookingService";
import { useNavigate } from "react-router-dom";
const STEP_LABELS = ["Service", "Date & Time", "Details", "Review"];

export default function Book() {
  const { currentStepIndex, next, back } = useMultiStepForm(STEP_LABELS);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });
  const navigate = useNavigate();
const [bookingTotal, setBookingTotal] = useState(null);

const handleConfirm = async ({ total, coupon }) => {
  try {
    setSubmitting(true);

    const bookingNumber = `MSP${Date.now()}`;

    // const bookingData = {
    //   booking_number: bookingNumber,

    //   service: service?.title,
    //   category: service?.category,

    //   booking_date: date,
    //   booking_time: time,

    //   customer_name: details.name,
    //   email: details.email,
    //   phone: details.phone,
    //   notes: details.notes,

    //   coupon_code: coupon?.code ?? null,

    //   subtotal: service?.price ?? 0,
    //   discount: coupon
    //     ? coupon.type === "percent"
    //       ? Math.round((service.price * coupon.value) / 100)
    //       : coupon.value
    //     : 0,

    //   total_amount: total,

    //   payment_status: "Pending",
    //   booking_status: "Pending",
    //   upload_status: "Waiting",

    //   admin_notes: null,
    // };

    // console.log("Booking Data:", bookingData);
   
    //new
    const bookingData = {
  booking_number: bookingNumber,

  service: service?.title,
  category: service?.category,

  booking_date: date,
  booking_time: time,

  customer_name: details.name,
  email: details.email,
  phone: details.phone,
  notes: details.notes,

  coupon_code: coupon?.code ?? null,

  subtotal: Number(service?.price ?? 0),

  discount: coupon
    ? coupon.type === "percent"
      ? Math.round((Number(service?.price ?? 0) * coupon.value) / 100)
      : coupon.value
    : 0,

  total_amount: String(total ?? 0),

  payment_status: "Pending",
  booking_status: "Pending",
  upload_status: "Waiting",

  admin_notes: null,
     };
    
    const savedBooking = await createBooking(bookingData);

    console.log(savedBooking);

    setBookingTotal(total);
    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Failed to submit booking.");
  } finally {
    setSubmitting(false);
  }
};
  

if (submitted) {
    return (
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24">
        <Confirmation service={service} total={bookingTotal} />
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-20">
      <SEO
        title="Book a Session"
        description="Book your photography or videography session with MSP Videography."
        path="/book"
      />
      <p className="text-base text-gray-600 mt-2 leading-relaxed">
            If you have already completed your booking and are waiting to make the payment,
            click the Pay Now button to continue.
          </p>
      <button
        onClick={() => navigate("/payment")}
        className="px-6 py-3 mb-[10px] bg-msp-blue bg-blue-400 text-white rounded-lg font-semibold transition-colors"
      >
        Pay Now
      </button>
      <div className="mb-14">
        <StepIndicator labels={STEP_LABELS} currentIndex={currentStepIndex} />
      </div>

      {currentStepIndex === 0 && (
        <ServiceStep value={service} onChange={setService} onNext={next} />
      )}
      {currentStepIndex === 1 && (
          <DateTimeStep
            date={date}
            time={time}
            onChangeDate={setDate}
            onChangeTime={setTime}
            onNext={next}
            onBack={back}
          />
        )}
        {currentStepIndex === 2 && (
        <DetailsStep details={details} onChange={setDetails} onNext={next} onBack={back} />
      )}
      {currentStepIndex === 3 && (
        <ReviewStep
          service={service}
          date={date}
          time={time}
          details={details}
          onConfirm={handleConfirm}
          onBack={back}
          submitting={submitting}
        />
      )} 
      

    </section>
  );
}

