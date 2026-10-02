import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const emptyForm = { title: "", type: "Strength", duration: 45, calories: 300 };

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [member, setMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const refresh = () => {
    api.getWorkouts().then(setWorkouts);
    api.getMember().then(setMember);
  };

  useEffect(refresh, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    await api.logWorkout(form);
    setForm(emptyForm);
    setMessage("Workout logged — +15 points");
    refresh();
  };

  const hasWearable = member?.wearables?.length > 0;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <SectionHeading
          eyebrow="Biometric integration"
          title="Workout Log"
          subtitle="Heart-rate, sleep, recovery and load data inform your coaching — synced from your wearable or logged manually."
        />
        <div className="space-y-3">
          {workouts.map((w) => (
            <Card key={w.id} className="flex justify-between items-center">
              <div>
                <div className="font-display uppercase">{w.title}</div>
                <div className="text-den-muted text-sm">
                  {w.type} · {w.duration} min · {w.calories} kcal
                </div>
              </div>
              <span
                className={`text-xs uppercase tracking-wide ${
                  w.source === "wearable" ? "text-den-green" : "text-den-muted"
                }`}
              >
                {w.source === "wearable" ? "Synced from wearable" : "Manual"}
              </span>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg uppercase tracking-wide mb-4">Log a Workout</h2>
        {!hasWearable && (
          <div className="text-xs text-den-muted mb-4">
            No wearable connected — connect one in your{" "}
            <a href="/profile" className="text-den-orange">
              Profile
            </a>{" "}
            to auto-log sessions.
          </div>
        )}
        <Card>
          <form onSubmit={submit} className="space-y-3 text-sm">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2"
              placeholder="Session title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <select
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {["Strength", "Cardio", "Studio", "Recovery", "Sport"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <input
                type="number"
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2"
                placeholder="Minutes"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              />
              <input
                type="number"
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2"
                placeholder="Calories"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
              />
            </div>
            <button className="w-full py-2 rounded-md bg-den-orange text-black uppercase text-sm font-semibold tracking-wide hover:bg-den-orange/80">
              Log Workout
            </button>
          </form>
        </Card>
        {message && (
          <div className="mt-4 text-den-green bg-den-green/10 border border-den-green/30 rounded-md p-3 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
