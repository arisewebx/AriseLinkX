/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const VIEWS = ["Day", "Week", "Month", "Year"];

function buildDayData(stats) {
  // Last 24 hours, grouped by hour
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - 23 + i, 0, 0, 0);
    return {
      label: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ts: d,
      count: 0,
    };
  });

  stats.forEach((click) => {
    const t = new Date(click.created_at);
    const diffH = Math.floor((now - t) / 3600000);
    if (diffH < 24) {
      const idx = 23 - diffH;
      if (hours[idx]) hours[idx].count++;
    }
  });

  return hours.map(({ label, count }) => ({ label, count }));
}

function buildWeekData(stats) {
  // Last 7 days
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 6 + i);
    return {
      label: d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
      date: d.toDateString(),
      count: 0,
    };
  });

  stats.forEach((click) => {
    const ds = new Date(click.created_at).toDateString();
    const day = days.find((d) => d.date === ds);
    if (day) day.count++;
  });

  return days.map(({ label, count }) => ({ label, count }));
}

function buildMonthData(stats) {
  // Last 30 days
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 29 + i);
    return {
      label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      date: d.toDateString(),
      count: 0,
    };
  });

  stats.forEach((click) => {
    const ds = new Date(click.created_at).toDateString();
    const day = days.find((d) => d.date === ds);
    if (day) day.count++;
  });

  return days.map(({ label, count }) => ({ label, count }));
}

function buildYearData(stats) {
  // Last 12 months
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      label: d.toLocaleDateString([], { month: "short" }) + " '" + String(d.getFullYear()).slice(-2),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    };
  });

  stats.forEach((click) => {
    const t = new Date(click.created_at);
    const m = months.find(
      (d) => d.year === t.getFullYear() && d.month === t.getMonth()
    );
    if (m) m.count++;
  });

  return months.map(({ label, count }) => ({ label, count }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-orange-500">
          {payload[0].value} {payload[0].value === 1 ? "click" : "clicks"}
        </p>
      </div>
    );
  }
  return null;
};

export default function ClicksChart({ stats = [] }) {
  const [view, setView] = useState("Week");

  const data =
    view === "Day"
      ? buildDayData(stats)
      : view === "Week"
      ? buildWeekData(stats)
      : view === "Month"
      ? buildMonthData(stats)
      : buildYearData(stats);

  const total = data.reduce((s, d) => s + d.count, 0);

  // Show every nth label to avoid crowding
  const tickInterval =
    view === "Month" ? 4 : view === "Day" ? 3 : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400">
            {total} click{total !== 1 ? "s" : ""} in this period
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                view === v
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f97316", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#clickGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
