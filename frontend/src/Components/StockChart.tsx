import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './StockChart.css';


interface StockData {
 date: string;
 value: number;
}


interface StockChartProps {
 data: StockData[];
}


export const StockChart = ({ data }: StockChartProps) => {
 return (
   <div className="chart-wrapper">
     <ResponsiveContainer width="100%" height="100%">
       <LineChart data={data}>
         <XAxis
           dataKey="date"
           stroke="#6b7280"
           tick={{ fill: '#6b7280' }}
         />
         <YAxis
           stroke="#6b7280"
           tick={{ fill: '#6b7280' }}
         />
         <Tooltip
           contentStyle={{
             background: '#fff',
             border: '1px solid #e5e7eb',
             borderRadius: '4px',
             padding: '8px'
           }}
         />
         <Line
           type="monotone"
           dataKey="value"
           stroke="#4f46e5"
           strokeWidth={2}
           dot={false}
         />
       </LineChart>
     </ResponsiveContainer>
   </div>
 );
};
