import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const wearableOptions = ["Apple Health", "Fitbit", "Garmin", "Whoop"];

export default function Profile() {
  const [member, setMember] = useState(null);

  const refresh = () => {
    api.getMember().then(setMember);
  };
  useEffect(refresh, []);

  const toggle = async (provider) => {
    if (member.wearables.includes(provider)) {
      await api.disconnectWearable(provider);
    } else {
      await api.connectWearable(provider);
    }
    refresh();
  };

  if (!member) return null;

  return (
    <div>
      <SectionHeading eyebrow="Your Profile" title={member.name} subtitle={member.email} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="font-display uppercase mb-3">Membership</div>
          <div className="text-den-muted text-sm">
            Current tier:{" "}
            <span className="text-den-cream">
              {member.membership_tier?.replace("_", " ") || "Not selected"}
            </span>
          </div>
          <div className="text-den-muted text-sm mt-1">
            Rewards points: <span className="text-den-cream">{member.points}</span>
          </div>
        </Card>

        <Card>
          <div className="font-display uppercase mb-3">Wearable Sync</div>
          <p className="text-den-muted text-sm mb-4">
            Connect a device so your workouts, heart-rate and recovery data flow straight into
            Lyon's Den coaching and rewards.
          </p>
          <div className="space-y-2">
            {wearableOptions.map((w) => {
              const connected = member.wearables.includes(w);
              return (
                <div
                  key={w}
                  className="flex justify-between items-center bg-black/30 border border-white/10 rounded-md px-3 py-2"
                >
                  <span className="text-sm">{w}</span>
                  <button
                    onClick={() => toggle(w)}
                    className={`text-xs uppercase tracking-wide px-3 py-1 rounded-md font-semibold ${
                      connected
                        ? "bg-den-green/20 text-den-green"
                        : "bg-den-orange text-black hover:bg-den-orange/80"
                    }`}
                  >
                    {connected ? "Connected" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
