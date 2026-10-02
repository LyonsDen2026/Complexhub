import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Home() {
  const [member, setMember] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rewards, setRewards] = useState(null);

  useEffect(() => {
    api.getMember().then(setMember);
    api.getBookings().then(setBookings);
    api.getRewards().then(setRewards);
  }, []);

  const quickLinks = [
    { to: "/book", label: "Book a Class", desc: "Train, recover, play or connect" },
    { to: "/shop", label: "Member Store", desc: "Apparel, recovery & partner brands" },
    { to: "/workouts", label: "Log a Workout", desc: "Sync progress, earn points" },
    { to: "/memberships", label: "Membership", desc: "Manage your tier & household" },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow="Welcome back"
        title={member ? `Hey, ${member.name.split(" ")[0]}` : "Hey, Athlete"}
        subtitle="One house. A whole day of possibility — train, recover, work, learn and belong."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card highlight>
          <div className="text-den-muted text-xs uppercase tracking-wide mb-1">Membership</div>
          <div className="text-2xl font-display uppercase">
            {member?.membership_tier?.replace("_", " ") || "Not selected"}
          </div>
        </Card>
        <Card>
          <div className="text-den-muted text-xs uppercase tracking-wide mb-1">Rewards Points</div>
          <div className="text-2xl font-display">{rewards?.points ?? "—"} pts</div>
        </Card>
        <Card>
          <div className="text-den-muted text-xs uppercase tracking-wide mb-1">Upcoming Bookings</div>
          <div className="text-2xl font-display">{bookings.length}</div>
        </Card>
      </div>

      <h2 className="font-display text-xl uppercase tracking-wide mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((l) => (
          <Link key={l.to} to={l.to}>
            <Card className="h-full hover:border-den-orange transition-colors">
              <div className="font-display uppercase mb-1">{l.label}</div>
              <div className="text-den-muted text-sm">{l.desc}</div>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-xl uppercase tracking-wide mb-4">Your Next Sessions</h2>
      <div className="space-y-3">
        {bookings.length === 0 && (
          <Card className="text-den-muted">
            No sessions booked yet. <Link to="/book" className="text-den-orange">Book one now →</Link>
          </Card>
        )}
        {bookings.map((b) => (
          <Card key={b.id} className="flex justify-between items-center">
            <div>
              <div className="font-display uppercase">{b.title}</div>
              <div className="text-den-muted text-sm">
                {b.day} · {b.time} · {b.coach}
              </div>
            </div>
            <span className="text-xs uppercase tracking-wide text-den-green">{b.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
