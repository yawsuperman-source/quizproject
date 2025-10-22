'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ResultsChartProps = {
  correct: number;
  incorrect: number;
};

const COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))'];

export function ResultsChart({ correct, incorrect }: ResultsChartProps) {
  const data = [
    { name: 'Correct', value: correct },
    { name: 'Incorrect', value: incorrect },
  ];

  if (correct === 0 && incorrect === 0) {
    return (
        <div className="text-center text-muted-foreground">
            No data to display.
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
