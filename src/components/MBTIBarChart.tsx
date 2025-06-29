import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface MBTIBarChartProps {
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

const MBTIBarChart = ({ scores }: MBTIBarChartProps) => {
  const getPercentage = (a: number, b: number) => {
    const total = a + b;
    return total === 0 ? 50 : Math.round((a / total) * 100);
  };

  const data = [
    {
      dimension: "E vs I",
      leftLabel: "Extraversion (E)",
      rightLabel: "Introversion (I)",
      left: getPercentage(scores.E, scores.I),
      right: getPercentage(scores.I, scores.E),
    },
    {
      dimension: "S vs N",
      leftLabel: "Sensing (S)",
      rightLabel: "Intuition (N)",
      left: getPercentage(scores.S, scores.N),
      right: getPercentage(scores.N, scores.S),
    },
    {
      dimension: "T vs F",
      leftLabel: "Thinking (T)",
      rightLabel: "Feeling (F)",
      left: getPercentage(scores.T, scores.F),
      right: getPercentage(scores.F, scores.T),
    },
    {
      dimension: "J vs P",
      leftLabel: "Judging (J)",
      rightLabel: "Perceiving (P)",
      left: getPercentage(scores.J, scores.P),
      right: getPercentage(scores.P, scores.J),
    },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
          <YAxis
            dataKey="dimension"
            type="category"
            axisLine={false}
            tickLine={false}
          />
          <XAxis type="number" hide />
          <Bar dataKey="left" fill="#3b82f6" stackId="a">
            <LabelList dataKey="leftLabel" position="insideLeft" fill="#fff" />
          </Bar>
          <Bar dataKey="right" fill="#a855f7" stackId="a">
            <LabelList dataKey="rightLabel" position="insideRight" fill="#fff" />
          </Bar>
          <Tooltip formatter={(value: any) => `${value}%`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MBTIBarChart;
