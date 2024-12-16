import * as React from 'react';
import { Col, Row, Button, Card, Timeline } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ItemUser, MemberLogDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import moment from 'moment';
import { eMemberAction, eUserType } from '@src/lib/enumconst';
import ModalExportMemberLog from './components/ModalExportMemberLog';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectUser from '@src/components/Manager/SelectUser';

export interface IProps {
	memberId?: number;
}
export default class MemberLog extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleExportExcelMemberLog: false,
		me_id: undefined,
	};

	async componentDidMount() {
		if (this.props.memberId != undefined) {
			await this.setState({ me_id: this.props.memberId });
		}
		await this.getAllMember();
		await this.getAll();
	}
	async componentDidUpdate(prevProps) {
		if (this.props.memberId !== prevProps.memberId) {
			await this.setState({ me_id: this.props.memberId });
			await this.getAll();
		}
	}

	async getAllMember() {
		this.setState({ isLoadDone: false });
		await stores.memberStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined);
		this.setState({ isLoadDone: true });
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.memberLogStore.getAll(this.state.me_id, undefined, undefined);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		await this.getAll();
	}

	render() {
		const { memberLogListResult } = stores.memberLogStore;
		let colorTimeline = "";
		return (
			<Card>
				<Row gutter={[16, 16]}>
					<Col span={6}>
						<h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{L('MemberLog')}</h3>
					</Col>
					{!this.props.memberId &&
						<>
							<Col span={8} style={{ fontSize: '16px' }}>
								<SelectUser role_user={eUserType.Member.num} onChangeUser={async (item_arr: ItemUser[]) => await this.setState({ me_id: item_arr[0].me_id })} />
							</Col>
							<Col span={5}>
								<Button type='primary' onClick={() => this.getAll()}>{L("tim_kiem")}</Button>
							</Col>
						</>
					}
				</Row>
				{
					(memberLogListResult.length > 0 && memberLogListResult != undefined) ?
						<Timeline mode="alternate" style={{ paddingTop: '10px', overflow: "auto", maxHeight: '70vh', overflowX: "hidden", }}>
							{memberLogListResult.map((item: MemberLogDto, index: number) => {
								switch (item.me_lo_action) {
									case eMemberAction.ChangeStatus.num:
										colorTimeline = 'silver'
										break;
									case eMemberAction.ChangeMoney.num:
										colorTimeline = 'gold'
										break;
									case eMemberAction.Lock.num:
										colorTimeline = 'red'
										break;
									case eMemberAction.UnLock.num:
										colorTimeline = '#40a9ff'
										break;
									case eMemberAction.Create.num:
										colorTimeline = 'green'
										break;
									default:
										colorTimeline = '#FF0000'
										break;
								}
								return <Timeline.Item color={colorTimeline} key={item.me_lo_id + "_" + index}>
									<p>{stores.sessionStore.getMemberNameById(item.me_id)}</p>
									<p>{item.me_lo_data}</p>
									<p>{moment(item.me_lo_created_at).format("HH:mm:ss DD/MM/YYYY")}</p>
								</Timeline.Item>
							})

							}
						</Timeline>
						:
						<div><h4>{L('NoData')}</h4></div>
				}

				<ModalExportMemberLog
					memberLogListResult={memberLogListResult}
					visible={this.state.visibleExportExcelMemberLog}
					onCancel={() => this.setState({ visibleExportExcelMemberLog: false })}
				/>
			</Card >
		)
	}
}