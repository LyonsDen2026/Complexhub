import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const perks = [
  { label: "20% Store Discount", cost: 1000 },
  { label: "Free Recovery Session", cost: 1500 },
  { label: "Guest Day Pass", cost: 800 },
  { label: "Prize Draw Entry", cost: 500 },
];

export default function Rewards() {
  const [rewards, setRewards] = useState(null);

  useEffect(() => {
    api.getRewards().then(setRewards);
  }, []);

  return (
    <div>
      <SectionHeading
        eyebrow="Lyon's Den Rewards"
        title="Points & Prizes"
        subtitle="Earn points for every booking, workout and purchase — redeem for perks across the club."
      />

      <Card highlight className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-den-muted text-xs uppercase tracking-wide mb-1">Your Balance</div>
          <div className="text-4xl font-display">{rewards?.points ?? "—"} pts</div>
        </div>
      </Card>

      <h2 className="font-display text-xl uppercase tracking-wide mb-4">Redeem</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {perks.map((p) => {
          const unlocked = (rewards?.points ?? 0) >= p.cost;
          return (
            <Card key={p.label} className="text-center">
              <div className="font-display uppercase mb-2">{p.label}</div>
              <div className="text-den-muted text-sm mb-3">{p.cost} pts</div>
              <span
                className={`text-xs uppercase tracking-wide ${
                  unlocked ? "text-den-green" : "text-den-muted"
                }`}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </span>
            </Card>
          );
        })}
      </div>

      <h2 className="font-display text-xl uppercase tracking-wide mb-4">Activity</h2>
      <div className="space-y-2">
        {rewards?.log.map((entry) => (
          <Card key={entry.id} className="flex justify-between items-center text-sm">
            <span>{entry.reason}</span>
            <span className="text-den-green font-display">+{entry.points}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
