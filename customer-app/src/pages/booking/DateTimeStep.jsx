import { useEffect, useMemo } from "react";
import { cn } from "@/utils/cn";
import { TIME_SLOTS, getUnavailableSlots } from "@/constants/bookingContent";

export default function DateTimeStep({ date, time, onChangeDate, onChangeTime, onNext, onBack }) {
  // const today = new Date().toISOString().split("T")[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

const minDate = tomorrow.toISOString().split("T")[0];

  const unavailableSlots = useMemo(() => getUnavailableSlots(date), [date]);

  // If the selected time becomes unavailable after changing the date, clear it.
  useEffect(() => {
    if (time && unavailableSlots.includes(time)) {
      onChangeTime("");
    }
  }, [unavailableSlots, time, onChangeTime]);

  return (
    <div>
      <p className="eyebrow mb-2 text-center">Step 2 of 4</p>
      <h2 className="font-display text-3xl text-center mb-10">Pick a date & time</h2>

      <div className="max-w-md mx-auto flex flex-col gap-8">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
            Date
          </span>
          <input
            type="date"
            
            // min={today}
            min={minDate}
            
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
            style={{ colorScheme: "light" }}
            className="border border-mist bg-white px-4 py-3 text-sm text-ink
                       focus:outline-none focus:border-brand transition-colors duration-300"
          />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest2 uppercase text-steel">
              Time
            </span>
            {date && (
              <span className="flex items-center gap-2 text-[11px] font-mono text-steel">
                <span className="w-2 h-2 bg-mist border border-steel/40 inline-block" />
                Booked
              </span>
            )}
          </div>

          {!date ? (
            <p className="mt-3 text-sm text-steel">Choose a date to see available times.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isUnavailable = unavailableSlots.includes(slot);
                const isSelected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => onChangeTime(slot)}
                    title={isUnavailable ? "Already booked" : undefined}
                    className={cn(
                      "border px-4 py-3 text-sm font-mono transition-colors duration-300 relative",
                      isUnavailable &&
                        "border-mist bg-mist/60 text-steel/50 cursor-not-allowed line-through",
                      !isUnavailable &&
                        isSelected &&
                        "border-brand bg-brand text-white",
                      !isUnavailable &&
                        !isSelected &&
                        "border-mist text-ink hover:border-brand"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <button type="button" onClick={onBack} className="btn-ghost">
          Back
        </button>
        <button
          type="button"
          disabled={!date || !time}
          onClick={onNext}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}