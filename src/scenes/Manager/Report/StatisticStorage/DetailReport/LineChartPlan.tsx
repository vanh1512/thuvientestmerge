import { CloseOutlined } from '@ant-design/icons';
import { StatisticPlanWithMonthDto } from '@src/services/services_autogen';
import { Button, Col, Row, } from 'antd';
import * as React from 'react';
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, Bar, BarChart, Label } from 'recharts';

export interface IProps {
    listStatisticMostPlan: StatisticPlanWithMonthDto[],
    titleTable: string,
    onCancelChart: () => void,
}
export default class LineChartPlan extends React.Component<IProps>{
    render() {
        const { listStatisticMostPlan } = this.props;
        const slicedData = listStatisticMostPlan.slice(0, 12);
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
                <Row style={{ justifyContent: 'center' }}>
                    <ResponsiveContainer width={"90%"} height={350}>
                        <BarChart data={slicedData} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nameDisplay" interval={0} textAnchor="middle" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8">
                                <Label
                                    value="Số lượng"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#808080' }}
                                />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d">
                                <Label
                                    value="Tổng tiền"
                                    angle={90}
                                    position="insideRight"
                                    style={{ textAnchor: 'middle', fill: '#808080' }}
                                    dx={20} 
                                    dy={-10} 
                                />
                            </YAxis>
                            <Tooltip />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="plans.length" fill="#8884d8" name={"Kế hoạch"} />
                            <Bar yAxisId="right" dataKey="totalPriceplans" fill="#82ca9d" name={"Tổng tiền(VND)"} />
                        </BarChart>
                    </ResponsiveContainer>

                </Row>
            </>
        )
    }
}
