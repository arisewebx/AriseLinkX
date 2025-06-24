/* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Location({stats = []}) {
  const cityCount = stats.reduce((acc, item) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }
    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <LineChart width={700} height={300} data={cities.slice(0, 5)}>
          <XAxis 
            dataKey="city" 
            tick={{ fill: 'white', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          />
          <YAxis 
            tick={{ fill: 'white', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: '#06d6a0' }}
          />
          <Legend 
            wrapperStyle={{ color: 'white' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#06d6a0"
            strokeWidth={3}
            dot={{ fill: '#06d6a0', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#06d6a0', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}