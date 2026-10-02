import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Memberships() {
  const [tiers, setTiers] = useState([]);
  const [member, setMember] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.getMemberships().then(setTiers);
    api.getMember().then(setMember);
  }, []);

  const select = async (tierId) => {
    await api.selectMembership(tierId);
    const updated = await api.getMember();
    setMember(updated);
    setStatus(`Membership updated — ${tiers.find((t) => t.id === tierId)?.name}. +100 points earned.`);
  };

  return (
    <div>
      <SectionHeading
        eyebrow="One membership ecosystem"
        title="Membership Tiers"
        subtitle="Train, recover, work, learn and belong — pick the tier that fits your household."
      />
      {status && (
        <div className="mb-6 text-den-green bg-den-green/10 border border-den-green/30 rounded-md p-3 text-sm">
          {status}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => {
          const active = member?.membership_tier === t.id;
          return (
            <Card key={t.id} highlight={!!t.highlight} className="flex flex-col justify-between">
              <div>
                <div className="font-display text-lg uppercase">{t.name}</div>
                <div className="text-2xl font-display my-2">
                  {t.price}
                  <span className="text-den-muted text-sm">{t.period}</span>
                </div>
                <p className="text-den-muted text-sm mb-3">{t.description}</p>
                <ul className="text-sm space-y-1 mb-4">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-den-orange">—</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => select(t.id)}
                disabled={active}
                className={`w-full py-2 rounded-md uppercase text-sm tracking-wide font-semibold transition-colors ${
                  active
                    ? "bg-den-green/20 text-den-green cursor-default"
                    : "bg-den-orange text-black hover:bg-den-orange/80"
                }`}
              >
                {active ? "Current Plan" : "Select"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
