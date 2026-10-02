import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const sections = ["All", "Train", "Recover", "Perform", "Connect", "Youth", "Belong"];

export default function Book() {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  const refresh = () => {
    api.getClasses().then(setClasses);
    api.getBookings().then(setBookings);
  };

  useEffect(refresh, []);

  const bookedIds = useMemo(() => new Set(bookings.map((b) => b.id && b.class_id)), [bookings]);
  const bookedClassIds = useMemo(
    () => new Set(bookings.map((b) => b.day + b.time + b.title)),
    [bookings]
  );

  const filtered = classes.filter((c) => filter === "All" || c.section === filter);

  const book = async (cls) => {
    try {
      await api.bookClass(cls.id);
      setMessage(`Booked ${cls.title} — +25 points`);
      refresh();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Assess · Develop · Perform · Recover · Connect"
        title="Book Your Session"
        subtitle="Classes, studios, courts, youth programs and member events — one coordinated journey."
      />

      {message && (
        <div className="mb-6 text-den-green bg-den-green/10 border border-den-green/30 rounded-md p-3 text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wide whitespace-nowrap border ${
              filter === s
                ? "bg-den-orange text-black border-den-orange"
                : "border-white/15 text-den-muted hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((cls) => {
          const isBooked = bookedClassIds.has(cls.day + cls.time + cls.title);
          return (
            <Card key={cls.id} className="flex justify-between items-start gap-4">
              <div>
                <div className="text-den-orange text-xs uppercase tracking-wide mb-1">
                  {cls.section}
                </div>
                <div className="font-display text-lg uppercase">{cls.title}</div>
                <div className="text-den-muted text-sm mt-1">
                  {cls.day} · {cls.time} · {cls.coach}
                </div>
                <div className="text-xs text-den-muted mt-2">
                  {cls.spots_left > 0 ? `${cls.spots_left} spots left` : "Full"}
                </div>
              </div>
              <button
                onClick={() => book(cls)}
                disabled={isBooked || cls.spots_left <= 0}
                className={`shrink-0 px-4 py-2 rounded-md text-sm uppercase font-semibold tracking-wide ${
                  isBooked
                    ? "bg-den-green/20 text-den-green"
                    : cls.spots_left <= 0
                    ? "bg-white/10 text-den-muted cursor-not-allowed"
                    : "bg-den-orange text-black hover:bg-den-orange/80"
                }`}
              >
                {isBooked ? "Booked" : cls.spots_left <= 0 ? "Full" : "Book"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
