import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { detectors, radarData, toneVar, type DetectorId } from "@/data/detectors";

export function RadarCompare() {
  const [shown, setShown] = useState<Record<DetectorId, boolean>>({ film: true, ecran: true, cr: true, dr: true });
  return (
    <div className="glass p-6">
      <fieldset className="mb-4 flex flex-wrap gap-4">
        <legend className="sr-only">Détecteurs affichés</legend>
        {detectors.map((d) => (
          <label key={d.id} className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={shown[d.id]} onChange={() => setShown((s) => ({ ...s, [d.id]: !s[d.id] }))}
              className="h-4 w-4" style={{ accentColor: toneVar[d.tone] }} />
            <span style={{ color: toneVar[d.tone] }}>{d.short}</span>
          </label>
        ))}
      </fieldset>
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="72%">
            <PolarGrid stroke="var(--glass-border)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--glass-border)", borderRadius: 12 }} />
            {detectors.filter((d) => shown[d.id]).map((d) => (
              <Radar key={d.id} name={d.short} dataKey={d.id} stroke={toneVar[d.tone]} fill={toneVar[d.tone]} fillOpacity={0.15} strokeWidth={2} />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Scores qualitatifs (0–5) déduits du comparatif ; « dose faible » : plus le score est haut, mieux c'est.</p>
    </div>
  );
}
