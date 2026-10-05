import { HONEYPOT_FIELD } from "@/lib/spam";

/**
 * Hidden trap field for bots. Kept off-screen rather than display:none (some
 * bots skip hidden inputs) and out of the tab order and accessibility tree so
 * keyboard and screen-reader users never meet it.
 */
export default function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
