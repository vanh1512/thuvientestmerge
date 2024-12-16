import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import * as React from 'react';
import { StatisticBorrowReturningWithMonthDto } from '@src/services/services_autogen';
import { Button, Col, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export interface IProps {
    listStatisticBorrowReturningWithMonthDto: StatisticBorrowReturningWithMonthDto[],
    onCancelChart: () => void,
    titleChart: string,
}

export default class BarChartDocument extends React.Component<IProps> {
    render() {

        const { listStatisticBorrowReturningWithMonthDto, titleChart } = this.props;
        const slicedData = listStatisticBorrowReturningWithMonthDto.slice(0, 12);


        return (
            <>
                <Row>
                    <Col span={22}>
                        <h2>{"BIỂU ĐỒ TRẠNG THÁI CỦA " + this.props.titleChart.toUpperCase()}</h2>
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
                            <YAxis yAxisId="left" orientation="left" stroke="#808080" >
                                <Label
                                    value="Số lượng"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#808080' }}
                                />
                            </YAxis>

                            <Tooltip />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="borrows.length" fill="#8884d8" name={"Tài liệu mượn"} />
                            <Bar yAxisId="left" dataKey="returnings.length" fill="#82ca9d" name={"Tài liệu trả"} />
                        </BarChart>
                    </ResponsiveContainer>
                </Row>
            </>
        );
    }
}


