
import { CloseOutlined } from '@ant-design/icons';
import { StatisticBorrowReturningWithCategoryDto } from '@src/services/services_autogen';
import { Button, Col, Row } from 'antd';
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export class DataChart {
    name: string;
    key: string;
    color: string;
}

export interface IProps {
    listSlected: any,
    onCancelChart: () => void,
    titleTable: string,
    listLineChart: DataChart[],
}

export default class LineChartDocument extends React.Component<IProps> {
    customChartLabel = (props) => {
        const { index, x, y, payload } = props;
        return (
            <foreignObject key={index} x={x - 10} y={y} width={45} height={500} style={{ fontSize: '12px' }}>
                {payload.value}
            </foreignObject>
        )
    };
    render() {
        const { listSlected } = this.props;
        const slicedData = this.props.listSlected.slice(0, listSlected.length - 1);
        return (
            <>
                <Row>
                    <Col span={22}>
                        <h2>{this.props.titleTable.toLocaleUpperCase()}</h2>
                    </Col>
                    <Col span={2} style={{ alignItems: 'right' }}>
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancelChart()}>Hủy</Button>
                    </Col>
                </Row>
                <Row gutter={16} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width={'90%'} height={600}>
                        <LineChart data={slicedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="nameDisplay" height={150} interval={0} tick={this.customChartLabel} />
                            <YAxis ><Label
                                    value="Số lượng"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#808080' }}
                                /></YAxis>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            {this.props.listLineChart.map((item, index) =>
                                <Line key={index + "_key"} type="monotone" dataKey={item.key} stroke={item.color} name={item.name} activeDot={{ r: 12 }} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </Row>

            </>
        );
    }
};

