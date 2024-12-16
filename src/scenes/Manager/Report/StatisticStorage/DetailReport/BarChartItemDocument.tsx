import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import * as React from 'react';
import { Button, Col, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';


export class DataChart {
    name: string;
    key: string;
    color: string;
}

export interface IProps {
    itemSlected: any[];
    listDisplay: DataChart[];
    titleChart: string;
    onCancelChart: () => void;
}

export default class BarChartItemDocument extends React.Component<IProps> {
    getRandomColor = () => {
        // Tạo màu ngẫu nhiên bằng cách sử dụng Math.random()
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return randomColor;
    }
    render() {
        const { itemSlected, listDisplay, titleChart } = this.props;
        return (
            <>
                <Row>
                    <Col span={22}>
                        <h2>{this.props.titleChart.toUpperCase()}</h2>
                    </Col>
                    <Col span={2} style={{ alignItems: 'right', paddingRight: "20px" }}>
                        <Button icon={<CloseOutlined />} type="primary" danger onClick={() => this.props.onCancelChart()}>Hủy</Button>
                    </Col>
                </Row>
                <Row style={{ justifyContent: 'center' }}>
                    <ResponsiveContainer width={"90%"} height={350}>
                        <BarChart data={itemSlected} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoryName" interval={0} hide />
                            <YAxis yAxisId="left" orientation="left" stroke="#808080">
                                <Label
                                    value="Số lượng"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#808080' }}
                                />
                            </YAxis>
                            <Tooltip />
                            <Legend wrapperStyle={{ paddingTop: '20px', paddingLeft: '30px' }} />
                            {listDisplay.map(item =>
                                <Bar key={item.key} yAxisId="left" dataKey={item.key} name={item.name} fill={this.getRandomColor()} barSize={20} />
                            )}
                        </BarChart>

                    </ResponsiveContainer>
                </Row>
            </>
        );
    }
}


