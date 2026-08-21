import { useState, useMemo } from "react";
import CouponInput from "@/components/forms/CouponInput";

export default function ReviewStep({
  service,
  date,
  time,
  details,
  onConfirm,
  onBack,
  submitting
}) {
  const [coupon, setCoupon] = useState(null);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // const subtotal = service?.price ?? 0;
  const subtotal = Number(service?.price ?? 0);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
    return Math.min(coupon.value, subtotal);
  }, [coupon, subtotal]);

  // const total = Math.max(subtotal - discount, 0);
  const total = Number(Math.max(subtotal - discount, 0));
  return (
    <div>
      <p className="eyebrow mb-2 text-center">Step 4 of 4</p>
      <h2 className="font-display text-3xl text-center mb-10">Review & confirm</h2>

      <div className="max-w-md mx-auto flex flex-col gap-6">
        <div className="border border-mist bg-white divide-y divide-mist">
          <Row label="Service" value={service?.title} />
          <Row label="Category" value={service?.category} />
          <Row label="Date" value={formattedDate} />
          <Row label="Time" value={time} />
          <Row label="Name" value={details.name} />
          <Row label="Email" value={details.email} />
          <Row label="Phone" value={details.phone} />
          {details.notes && <Row label="Notes" value={details.notes} />}
        </div>

        <CouponInput
          appliedCoupon={coupon}
          onApply={setCoupon}
          onRemove={() => setCoupon(null)}
        />

        <div className="border border-mist bg-white divide-y divide-mist">
          {/* <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
          {coupon && (
            <Row
              label={`Discount (${coupon.code})`}
              value={`-₹${discount.toFixed(2)}`}
              valueClass="text-brand"
            />
          )} */}
          {/* <Row label="Total" value={`₹${total.toFixed(2)}`} bold /> */}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <button type="button" onClick={onBack} className="btn-ghost">
          Back
        </button>
       <button
          type="button"
          onClick={() => onConfirm({ total, coupon })}
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 text-sm">
      <span className="font-mono text-xs tracking-wideish uppercase text-steel">{label}</span>
      <span className={`text-right ${bold ? "text-ink font-medium" : "text-ink"} ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}