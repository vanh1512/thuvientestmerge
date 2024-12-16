import * as React from 'react';
import { Button, Row, Tabs, message, } from 'antd';
import { MemberCardDto, MemberDto, RechargeCardInput } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import RechargeCard from './RechargeCard';
import { stores } from '@src/stores/storeInitializer';

export interface Iprops {
    memberCardSelected: MemberCardDto | undefined;
    memberSelected: MemberDto | undefined;
    onCancel: () => void;
}
export const tabManager = {
    tab_1: L("RechargeMoney"),
    tab_2: L('ChangeMoney'),
}
export default class TabReChargeOrAddMoneyCard extends React.Component<Iprops> {
    state = {
        isLoadDone: false,
        change: false,
        moneyCard: -1,
    }
    onChangeTab = () => {
        this.setState({ change: !this.state.change });
    }
    onSaveOrChangeRechargeCard = async (changed: boolean) => {
        this.setState({ isLoadDone: false });

        let input = new RechargeCardInput();
        input.me_ca_id = this.props.memberCardSelected!.me_ca_id;
        input.me_ca_money = this.state.moneyCard!;
        if (/^\d+$/.test(this.state.moneyCard.toString())) {
            if (changed) {
                await stores.memberCardStore.changeMoneyCard(input);
                message.success(L("thay_doi_thanh_cong"));
            }
            else {
                if (+this.state.moneyCard.toString() <= 0) {
                    message.error(L("so_tien_phai_lon_hon_0"));
                    return;
                }
                await stores.memberCardStore.rechargeCard(input);
                message.success(L("nap_tien_thanh_cong"));
            }
        }
        else {
            message.error(L("chi_nhap_so_nguyen_duong"));
            return;
        }
        this.onCancel();
        this.setState({ isLoadDone: true });
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        return (
            <>
                <Row style={{ justifyContent: 'end', }}>
                    <Button style={{ margin: '0 0.5em 0.5em 0' }} danger onClick={() => { this.setState({ changed_money: false }); this.onCancel() }}>{L('Cancel')}</Button>
                    <Button type='primary' title={L('Save')} onClick={() => this.onSaveOrChangeRechargeCard(this.state.change)}>{L('Save')}</Button>
                </Row>
                <Tabs defaultActiveKey={tabManager.tab_1} onChange={this.onChangeTab}>
                    <Tabs.TabPane tab={tabManager.tab_1} key={tabManager.tab_1}>
                        <RechargeCard
                            changed={this.state.change}
                            memberCardSelected={this.props.memberCardSelected}
                            memberSelected={this.props.memberSelected}
                            onChangeRechargeCard={(value: number) => this.setState({ moneyCard: value })}
                        ></RechargeCard>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2} >
                        <RechargeCard
                            changed={this.state.change}
                            memberCardSelected={this.props.memberCardSelected}
                            memberSelected={this.props.memberSelected}
                            onChangeRechargeCard={(value: number) => this.setState({ moneyCard: value })}
                        ></RechargeCard>
                    </Tabs.TabPane>
                </Tabs>
            </>
        )
    }
}