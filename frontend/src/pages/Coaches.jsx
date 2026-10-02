import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import CoachAvatar from "../components/CoachAvatar.jsx";

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedCoach, setSelectedCoach] = useState(null);

  const refresh = () => {
    api.getCoaches().then(setCoaches);
    api.getBookings().then(setBookings);
  };

  useEffect(() => {
    refresh();
  }, []);

  const bookedKeys = new Set(bookings.map((b) => b.day + b.time + b.title));

  const book = async (cls) => {
    try {
      await api.bookClass(cls.id);
      setMessage(`Booked ${cls.title} with ${cls.coach} — +25 points`);
      refresh();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const coachDetail = selectedCoach
    ? coaches.find((c) => c.id === selectedCoach)
    : null;

  return (
    <div>
      <SectionHeading
        eyebrow="Meet the team"
        title="Our Coaches"
        subtitle="Book directly with a coach — see their weekly timetable and reserve your spot."
      />

      {message && (
        <div className="mb-6 text-den-green bg-den-green/10 border border-den-green/30 rounded-md p-3 text-sm">
          {message}
        </div>
      )}

      {/* Coach detail modal */}
      {coachDetail && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-30 p-4"
          onClick={() => setSelectedCoach(null)}
        >
          <Card
            className="max-w-lg w-full max-h-[85vh] overflow-y-auto"
            highlight
          >
            <div
              className="flex items-center gap-4 mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <CoachAvatar
                name={coachDetail.name}
                color={coachDetail.color}
                initials={coachDetail.initials}
                size={72}
              />
              <div>
                <div className="font-display text-xl uppercase">{coachDetail.name}</div>
                <div className="text-den-orange text-sm">{coachDetail.title}</div>
              </div>
            </div>
            <p className="text-den-muted text-sm mb-2" onClick={(e) => e.stopPropagation()}>
              {coachDetail.bio}
            </p>
            <div className="text-xs uppercase tracking-wide text-den-muted mb-4" onClick={(e) => e.stopPropagation()}>
              Specialty: {coachDetail.specialty}
            </div>
            <div className="text-den-orange text-xs uppercase tracking-wide mb-2" onClick={(e) => e.stopPropagation()}>
              Weekly Timetable
            </div>
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              {coachDetail.timetable.length === 0 && (
                <div className="text-den-muted text-sm">No scheduled sessions.</div>
              )}
              {coachDetail.timetable.map((cls) => {
                const isBooked = bookedKeys.has(cls.day + cls.time + cls.title);
                return (
                  <div
                    key={cls.id}
                    className="flex justify-between items-center bg-black/30 border border-white/10 rounded-md px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-semibold">{cls.title}</div>
                      <div className="text-den-muted text-xs">
                        {cls.day} · {cls.time} · {cls.section}
                      </div>
                    </div>
                    <button
                      onClick={() => book(cls)}
                      disabled={isBooked || cls.spots_left <= 0}
                      className={`text-xs uppercase tracking-wide px-3 py-1.5 rounded-md font-semibold ${
                        isBooked
                          ? "bg-den-green/20 text-den-green"
                          : cls.spots_left <= 0
                          ? "bg-white/10 text-den-muted cursor-not-allowed"
                          : "bg-den-orange text-black hover:bg-den-orange/80"
                      }`}
                    >
                      {isBooked ? "Booked" : cls.spots_left <= 0 ? "Full" : "Book"}
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="mt-4 w-full py-2 rounded-md bg-white/10 text-den-muted uppercase text-sm tracking-wide hover:bg-white/15"
              onClick={() => setSelectedCoach(null)}
            >
              Close
            </button>
          </Card>
        </div>
      )}

      {/* Coach cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {coaches.map((coach) => (
          <Card key={coach.id} className="flex gap-4">
            <CoachAvatar
              name={coach.name}
              color={coach.color}
              initials={coach.initials}
              size={64}
            />
            <div className="flex-1">
              <div className="font-display text-lg uppercase">{coach.name}</div>
              <div className="text-den-orange text-sm">{coach.title}</div>
              <p className="text-den-muted text-sm mt-1 line-clamp-2">{coach.bio}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-den-muted">
                  {coach.timetable.length} sessions this week
                </span>
                <button
                  onClick={() => setSelectedCoach(coach.id)}
                  className="text-xs uppercase tracking-wide px-3 py-1.5 rounded-md bg-den-orange text-black font-semibold hover:bg-den-orange/80"
                >
                  View Timetable
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
