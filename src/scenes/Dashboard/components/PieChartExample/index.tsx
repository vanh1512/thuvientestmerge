import { L } from '@src/lib/abpUtility';
import * as React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export interface IProps {
	childMemberCards: number;
	adultMemberCards: number;
}
class PieChartExample extends React.Component<IProps> {
	state = {
		activeIndex: 0,
	};

	data = [
		{ name: L('tre_con'), value: this.props.childMemberCards },
		{ name: L('nguoi_lon'), value: this.props.adultMemberCards },

	];
	getInitialState() {
		return {
			activeIndex: 0,
		};
	}

	onPieEnter(data: any, index: any) {
		this.setState({
			activeIndex: index,
		});
	}

	render() {
		const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
		return (
			<div style={{ justifyContent: 'center' }}>
				<ResponsiveContainer width={'100%'} height={350} >
					<PieChart >
						<Pie dataKey="value" data={this.data} style={{ justifyContent: 'center' }} outerRadius={100} fill="#82ca9d" label >
							{
								this.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
							}</Pie>
						<Legend />
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default PieChartExample;
