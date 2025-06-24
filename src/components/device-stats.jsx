/* eslint-disable react/prop-types */
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";

const COLORS = ["#8b5cf6", "#06d6a0", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export default function DeviceStats({stats}) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.payload.device}</p>
          <p className="text-cyan-400">
            Count: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-gray-300">
            {((data.value / stats.length) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({cx, cy, midAngle, innerRadius, outerRadius, device, percent}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${device}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{width: "100%", height: 350}}>
      <ResponsiveContainer>
        <PieChart width={700} height={350}>
          <Pie
            data={result}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={2}
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              color: 'white',
              paddingTop: '20px'
            }}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: 'white', fontSize: '14px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Statistics Summary */}
      {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4">
        {result.map((item, index) => (
          <div 
            key={item.device}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3 text-center"
          >
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="text-white font-medium text-sm">{item.device}</div>
            <div className="text-2xl font-bold text-white">{item.count}</div>
            <div className="text-xs text-gray-400">
              {((item.count / stats.length) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}