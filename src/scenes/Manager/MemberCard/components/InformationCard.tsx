import * as React from 'react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { MemberCardDto, MemberDto } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import { Avatar, Col, Row } from 'antd';
import { eMCardType, valueOfeMCardType } from '@src/lib/enumconst';
import moment from 'moment';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { CalendarOutlined, CreditCardOutlined, DollarOutlined, IdcardOutlined, MoneyCollectOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';

export interface IProps {
    memberCard: MemberCardDto;
    member: MemberDto[];
}
export default class InformationCard extends AppComponentBase<IProps> {

    render() {
        const { memberCard, member } = this.props;
        const result = member.find(item => item.me_id == memberCard.me_id);
        return (
            <>
                <h2>{L("Information") + " " + L("memberCard")}</h2>
                <Row>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 24, 24, 24)}></Col>
                </Row>
                <Row style={{ marginTop: 15 }}>
                    <Col span={14} style={{ background: "#27c683", borderRadius: 15, padding: 10, marginRight: 10 }}>
                        <Row style={{ alignItems: 'center' }}>
                            <Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}> {result != undefined &&
                                <Avatar style={{ marginLeft: "15%", marginBottom: 18 }} size={150} src={result.fi_id != undefined ? this.getFile(result.fi_id.id) : ""} />}
                            </Col>
                            <Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)} style={{ textAlign: 'left', justifyContent: "flex" }}>
                                <p><UserOutlined /> {L('Users')}: <strong>{result!.me_name}</strong> </p>
                                <p>{<IdcardOutlined />} {L("CardNumber")}:<strong> {memberCard.me_ca_number}</strong></p>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={9} style={{ paddingTop: 15, justifyContent: "flex" }} >
                        <p><WalletOutlined /> {L('Money')}: <strong>{AppConsts.formatNumber(memberCard.me_ca_money)} VND</strong> </p>
                        <p><CreditCardOutlined /> {L('CardType')}: <strong>{valueOfeMCardType(memberCard.me_ca_type)}</strong> </p>
                        <p><CalendarOutlined /> {L('ReceivingDate')}: <strong>{moment(memberCard.me_ca_time_receive).format("DD/MM/YYYY")}</strong></p>
                        <p><CalendarOutlined /> {L('ValidityStartDate')}: <strong>{moment(memberCard.me_ca_use_from).format("DD/MM/YYYY")}</strong></p>
                        <p><CalendarOutlined /> {L('ExpirationDate')}: <strong>{moment(memberCard.me_ca_use_to).format("DD/MM/YYYY")}</strong></p>
                    </Col>
                </Row>
            </>
        )
    }
}
