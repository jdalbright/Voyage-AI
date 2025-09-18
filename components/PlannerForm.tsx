import { FormEvent, useState } from "react";

export interface PlannerFormValues {
  originCity: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  interests: string;
  budget: "budget" | "moderate" | "luxury";
}

interface PlannerFormProps {
  onSubmit: (values: PlannerFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

/**
 * PlannerForm renders a controlled form for gathering itinerary inputs prior to
 * dispatching a request to the itinerary generation API.
 */
function PlannerForm({ onSubmit, isSubmitting = false, submitError = null }: PlannerFormProps) {
  const [formValues, setFormValues] = useState<PlannerFormValues>({
    originCity: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    interests: "",
    budget: "moderate"
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const start = new Date(formValues.startDate);
    const end = new Date(formValues.endDate);

    if (start > end) {
      setLocalError("End date must be on or after the start date.");
      return;
    }

    setLocalError(null);
    await onSubmit(formValues);
  };

  const isDateRangeInvalid = Boolean(localError);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-slate-900/60 p-8 shadow-2xl backdrop-blur border border-slate-800"
    >
      <h2 className="text-2xl font-semibold text-white">Plan Your Voyage</h2>
      <p className="mt-2 text-sm text-slate-300">
        Tell us about your dream trip and we&apos;ll craft a bespoke itinerary.
      </p>

      {(submitError || localError) && (
        <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {localError ?? submitError}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-200">
          Origin City
          <input
            type="text"
            required
            value={formValues.originCity}
            onChange={(event) =>
              setFormValues((prev) => ({ ...prev, originCity: event.target.value }))
            }
            className="mt-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none"
            placeholder="San Francisco"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-slate-200">
          Destination City
          <input
            type="text"
            required
            value={formValues.destinationCity}
            onChange={(event) =>
              setFormValues((prev) => ({ ...prev, destinationCity: event.target.value }))
            }
            className="mt-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none"
            placeholder="Tokyo"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-slate-200">
          Start Date
          <input
            type="date"
            required
            value={formValues.startDate}
            onChange={(event) =>
              setFormValues((prev) => ({ ...prev, startDate: event.target.value }))
            }
            className={`mt-2 rounded-md border bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none ${
              isDateRangeInvalid ? "border-red-500" : "border-slate-700"
            }`}
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-slate-200">
          End Date
          <input
            type="date"
            required
            value={formValues.endDate}
            onChange={(event) =>
              setFormValues((prev) => ({ ...prev, endDate: event.target.value }))
            }
            className={`mt-2 rounded-md border bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none ${
              isDateRangeInvalid ? "border-red-500" : "border-slate-700"
            }`}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col text-sm font-medium text-slate-200">
        Interests
        <textarea
          rows={4}
          value={formValues.interests}
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, interests: event.target.value }))
          }
          className="mt-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none"
          placeholder="Sushi, cherry blossoms, tech tours"
        />
      </label>

      <label className="mt-4 flex flex-col text-sm font-medium text-slate-200">
        Budget
        <select
          value={formValues.budget}
          onChange={(event) =>
            setFormValues((prev) => ({
              ...prev,
              budget: event.target.value as PlannerFormValues["budget"]
            }))
          }
          className="mt-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white focus:border-indigo-400 focus:outline-none"
        >
          <option value="budget">Budget</option>
          <option value="moderate">Moderate</option>
          <option value="luxury">Luxury</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Generating..." : "Generate My Itinerary"}
      </button>
    </form>
  );
}

export default PlannerForm;
