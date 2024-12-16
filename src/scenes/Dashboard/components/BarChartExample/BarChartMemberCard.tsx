import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text } from 'recharts';
import * as React from 'react';
import { ChartDashboardDto } from '@src/services/services_autogen';

export interface IProps{
	data:ChartDashboardDto[];
}
export default class BarChartMemberCard extends React.Component<IProps> {
	customChartLabel = (props) => {
		const { index, x, y, payload } = props;
		return (
			<foreignObject key={index} x={x - 30} y={y} width={70} height={300} style={{ fontSize: '11px' }}>
				{payload.value}
			</foreignObject>
		)
	};

	render() {
		return (
			<BarChart width={350} height={300} data={this.props.data} >
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" width={30} height={100} interval={0} tick={this.customChartLabel} />
				<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
				<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
				<Tooltip />
				<Legend />
				<Bar yAxisId="left" dataKey="newMemberCard" fill="#8884d8" />
				<Bar yAxisId="right" dataKey="acceptMemberCard" fill="#82ca9d" />
			</BarChart>
		)
	}
}