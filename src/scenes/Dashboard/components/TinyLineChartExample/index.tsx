import * as React from 'react';
import { LineChart, Line, Legend, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import './index.less';
import { L } from '@src/lib/abpUtility';

export interface IProps {
	data: any;
}



export default class TinyLineChartExample extends React.Component<IProps> {

	customTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<p className="label">{L(`${payload[0].payload.title} : ${payload[0].value}`)}</p>
				</div>
			);
		}
		return null;
	};
	render() {
		return (
			<div style={{ position: "relative" }}>
				<ResponsiveContainer width={"110%"} height={200}>
					<LineChart data={this.props.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<XAxis dataKey="name" hide />
						<YAxis hide />
						<Tooltip content={this.customTooltip} cursor={{ stroke: "transparent" }} />
						<Line type="monotone" dataKey="body" name={L("Contract")} stroke="#fff" activeDot={{ r: 12 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		)
	}
}