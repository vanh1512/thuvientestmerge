import { CloseOutlined } from '@ant-design/icons';
import { StatisticStatusOfMembersDto } from '@src/services/services_autogen';
import { Button, Col, Row } from 'antd';
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export interface IProps {
    listStatisticStatusOfMembersDto: StatisticStatusOfMembersDto[],
    titleTable: string,
    onCancelChart: () => void,
}

export default class LineChartMember extends React.Component<IProps> {

    render() {
        const { listStatisticStatusOfMembersDto } = this.props;
        const slicedData = listStatisticStatusOfMembersDto.slice(0, 12);
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
                        <LineChart data={slicedData} margin={{ top: 5, right: 60, left: 20, bottom: 5 }}>
                            <XAxis dataKey="nameDisplay" interval={0} textAnchor="middle" />
                            <YAxis><Label
                                value="Số lượng"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle', fill: '#808080' }}
                            />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="newMember.length" stroke="#8884d8" name={"Người dùng mới"} activeDot={{ r: 12 }} />
                            <Line type="monotone" dataKey="newMemberCard.length" stroke="#FF6633" name={"Thẻ người dùng mới"} activeDot={{ r: 12 }} />
                            <Line type="monotone" dataKey="memberCardExtend.length" stroke="#33FFFF" name={"Thẻ được gia hạn"} activeDot={{ r: 12 }} />
                            <Line type="monotone" dataKey="memberCardExpired.length" stroke="#0000CC" name={"Thẻ quá hạn"} activeDot={{ r: 12 }} />
                            <Line type="monotone" dataKey="memberCardBlock.length" stroke="#FF3333" name={"Thẻ bị khoá"} activeDot={{ r: 12 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Row>
            </>
        );
    }
};

