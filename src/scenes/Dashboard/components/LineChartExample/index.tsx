import { L } from '@src/lib/abpUtility';
import { ChartDashboardDto } from '@src/services/services_autogen';
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export interface IProps {
	data: ChartDashboardDto[];
}
export default class LineChartExample extends React.Component<IProps> {
	render() {
		return (
			<ResponsiveContainer height={300} width={'100%'}>
				<LineChart  data={this.props.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<XAxis dataKey="name" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="borrows" stroke="#8884d8" name={L("muon")} />
					<Line type="monotone" dataKey="returnings" name={L("tra")} stroke="#82ca9d" />
				</LineChart>
			</ResponsiveContainer>
		);
	}
};


