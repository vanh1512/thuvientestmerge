import * as React from 'react';
import { Row, Col, Card } from 'antd';
import { BookOutlined, TeamOutlined, CreditCardOutlined } from '@ant-design/icons';
import './index.less';
import TinyLineChartExample from './components/TinyLineChartExample';
import PieChartExample from './components/PieChartExample';
import LineChartExample from './components/LineChartExample';
import ListExample from './components/ListExample';
import { DashboardDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import BarChartMember from './components/BarChartExample/BarChartMember';
import moment from 'moment';
export class Dashboard extends React.Component<any> {
	state = {
		cardLoading: true,
		lineChartLoading: true,
		barChartLoading: true,
		pieChartLoading: true,
	};

	dashboard: DashboardDto = new DashboardDto();

	async componentDidMount() {
		setTimeout(() => this.setState({ cardLoading: false }), 1000);
		setTimeout(() => this.setState({ lineChartLoading: false }), 1500);
		setTimeout(() => this.setState({ barChartLoading: false }), 2000);
		setTimeout(() => this.setState({ pieChartLoading: false }), 2500);
		this.dashboard = await stores.dashboardStore.getAll();
	}

	render() {
		const { cardLoading, lineChartLoading, barChartLoading, pieChartLoading } = this.state;

		const planStatisticList = [
			{ title: L('planCreate'), body: this.dashboard.planCreate },
			{ title: L('planDoing'), body: this.dashboard.planDoing },
			{ title: L('planDone'), body: this.dashboard.planDone },
			{ title: L('Total'), body: this.dashboard.planCreate + this.dashboard.planDoing + this.dashboard.planDone },
		];

		const ContactStatisticList = [
			{ title: L('contractCreate'), body: this.dashboard.contractCreate },
			{ title: L('contractDoing'), body: this.dashboard.contractDoing },
			{ title: L('contractDone'), body: this.dashboard.contractDone },
			{ title: L('Total'), body: this.dashboard.contractDone + this.dashboard.contractCreate + this.dashboard.contractDoing },

		];

		const checkStatisticList = [
			{ title: L('checkCreate'), body: this.dashboard.checkCreate },
			{ title: L('checkDoing'), body: this.dashboard.checkDoing },
			{ title: L('checkDone'), body: this.dashboard.checkDone },
			{ title: L('Total'), body: this.dashboard.checkCreate + this.dashboard.checkDoing + this.dashboard.checkDone },
		];

		return (
			<Card>
				<Row gutter={[16, 16]} style={{ paddingBottom: "10px" }}>
					<Col xs={{ span: 24 }}
						sm={{ span: 12 }}
						md={{ span: 12 }}
						lg={{ offset: 0, span: 12 }}
						xl={{ offset: 0, span: 12 }}
						xxl={{ offset: 0, span: 12 }}>
						<Card className={'dasboardCard-membercard'} bodyStyle={{ padding: 10 }} loading={cardLoading} bordered={false}>
							<Row align='middle'>
								<Col span={8}>
									<TeamOutlined className={'dashboardCardIcon'} />
									<p className={'dashboardCardName'} style={{ margin: 0 }}>{L("Member")}</p>

								</Col>
								<Col span={16}>
									<label style={{ color: '#fff' }}>{L("doc_gia_chua_duoc_duyet")}: {this.dashboard.registerMembers}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("doc_gia_dang_su_dung")}: {this.dashboard.acceptMembers}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("doc_gia_bi_tu_choi")}: {this.dashboard.rejectMembers}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("doc_gia_bi_khoa")}: {this.dashboard.lockMembers}</label>
								</Col>
							</Row>
						</Card>
					</Col>
					<Col xs={{ span: 24 }}
						sm={{ span: 12 }}
						md={{ span: 12 }}
						lg={{ offset: 0, span: 12 }}
						xl={{ offset: 0, span: 12 }}
						xxl={{ offset: 0, span: 12 }}>
						<Card className={'dasboardCard-comment'} bodyStyle={{ padding: 10 }} loading={cardLoading} bordered={false}>
							<Row align='middle'>
								<Col span={8}>
									<BookOutlined className={'dashboardCardIcon'} />
									<p className={'dashboardCardName'} style={{ margin: 0 }}>{L("Document")}</p>
								</Col>
								<Col span={16}>
									<label style={{ color: '#fff' }}>{L("tai_lieu_co_the_cho_muon")}: {this.dashboard.documentValid}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_dang_cho_muon")}: {this.dashboard.documentBorrow}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_mat")}: {this.dashboard.documentLost}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_hong")}: {this.dashboard.documentBroken}</label>
									<br />
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={{ span: 24 }}
						sm={{ span: 12 }}
						md={{ span: 12 }}
						lg={{ offset: 0, span: 12 }}
						xl={{ offset: 0, span: 12 }}
						xxl={{ offset: 0, span: 12 }}>
						<Card className={'dasboardCard-task'} bodyStyle={{ padding: 10 }} loading={cardLoading} bordered={false}>
							<Row align='middle'>
								<Col span={8}>
									<CreditCardOutlined className={'dashboardCardIcon'} />
									<p className={'dashboardCardName'} style={{ margin: 0 }}>{L("MemberCard")}</p>

								</Col>

								<Col span={16}>
									<label style={{ color: '#fff' }}>{L("the_doc_gia_chua_duoc_duyet")}: {this.dashboard.registerMemberCards}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("the_doc_gia_dang_su_dung")}: {this.dashboard.creatingMemberCards}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("the_doc_gia_no_tai_lieu")}: {this.dashboard.debtDocumentMemberCards}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("the_doc_gia_qua_han")}: {this.dashboard.timeUpMemberCards}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("the_doc_gia_bi_khoa")}: {this.dashboard.lockMemberCards}</label>
								</Col>
							</Row>
						</Card>
					</Col>
					<Col xs={{ span: 24 }}
						sm={{ span: 12 }}
						md={{ span: 12 }}
						lg={{ offset: 0, span: 12 }}
						xl={{ offset: 0, span: 12 }}
						xxl={{ offset: 0, span: 12 }}>
						<Card className={'dasboardCard-ticket'} bodyStyle={{ padding: 10 }} loading={cardLoading} bordered={false}>
							<Row align='middle'>
								<Col span={8}>
									<BookOutlined className={'dashboardCardIcon'} />
									<p className={'dashboardCardName'} style={{ margin: 0 }}>{L("borrowing_returning")}</p>
								</Col>
								<Col span={14}>
									<label style={{ color: '#fff' }}>{L("tai_lieu_dang_duoc_cho_muon")}: {this.dashboard.borrowsDocuments}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_yeu_cau_gia_han")}: {this.dashboard.extendDocuments}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_bi_qua_han")}: {this.dashboard.dueDateDocuments}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_bi_mat")}: {this.dashboard.lostDocuments}</label>
									<br />
									<label style={{ color: '#fff' }}>{L("tai_lieu_can_thu_hoi")}: {this.dashboard.needRecoveredDocuments}</label>
									<br />

								</Col>

							</Row>
						</Card>
					</Col>

				</Row>

				<Row>
					<Col span={24}>
						<Card className={'dashboardBox'} title={L("bieu_do_muon_tra_tai_lieu_trong_nam") + " " + moment().format('YYYY')} loading={lineChartLoading} bordered={false}>
							<LineChartExample data={this.dashboard.chartDashboardDto!}/>
						</Card>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col
						xs={{ offset: 1, span: 22 }}
						sm={{ offset: 1, span: 22 }}
						md={{ offset: 1, span: 22 }}
						lg={{ offset: 0, span: 8 }}
						xl={{ offset: 0, span: 8 }}
						xxl={{ offset: 0, span: 8 }}
					>
						<Card className={'dashboardCardTinyLine'} loading={barChartLoading} bordered={false}>
							<Row gutter={24}>
								<Col span={12} style={{ alignItems: 'center', display: 'grid' }}>
									<ListExample value={planStatisticList} />
								</Col>
								<Col span={12} style={{ padding: 0, color: 'red' }}>
									<TinyLineChartExample data={planStatisticList} />
								</Col>
							</Row>
						</Card>
					</Col>
					<Col
						xs={{ offset: 1, span: 22 }}
						sm={{ offset: 1, span: 22 }}
						md={{ offset: 1, span: 22 }}
						lg={{ offset: 0, span: 8 }}
						xl={{ offset: 0, span: 8 }}
						xxl={{ offset: 0, span: 8 }}
					>
						<Card className={'latestSocialTrendsList'} loading={barChartLoading} bordered={false}>
							<Row gutter={24}>
								<Col span={12} style={{ alignItems: 'center', display: 'grid' }}>
									<ListExample value={ContactStatisticList} />
								</Col>
								<Col span={12} style={{ padding: 0, color: 'red' }}>
									<TinyLineChartExample data={ContactStatisticList} />
								</Col>
							</Row>
						</Card>
					</Col>
					<Col
						xs={{ offset: 1, span: 22 }}
						sm={{ offset: 1, span: 22 }}
						md={{ offset: 1, span: 22 }}
						lg={{ offset: 0, span: 8 }}
						xl={{ offset: 0, span: 8 }}
						xxl={{ offset: 0, span: 8 }}
					>
						<Card className={'answeredTickeds'} loading={barChartLoading} bordered={false}>
							<Row gutter={24}>
								<Col span={12} style={{ alignItems: 'center', display: 'grid' }}>
									<ListExample value={checkStatisticList} />
								</Col>
								<Col span={12} style={{ padding: 0, color: 'red' }}>
									<TinyLineChartExample data={checkStatisticList} />
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={{ offset: 1, span: 22 }}
						sm={{ offset: 1, span: 22 }}
						md={{ offset: 1, span: 22 }}
						lg={{ offset: 0, span: 22 }}
						xl={{ offset: 0, span: 16 }}
						xxl={{ offset: 0, span: 16 }}>
						<Card title={L("bieu_do_nguoi_dung_moi_trong_nam") + " " + moment().format('YYYY')} className={'dashboardBox'} loading={barChartLoading} bordered={false}>
							<BarChartMember data={this.dashboard.chartDashboardDto!} />
						</Card>
					</Col>
					<Col xs={{ offset: 1, span: 22 }}
						sm={{ offset: 1, span: 22 }}
						md={{ offset: 1, span: 22 }}
						lg={{ offset: 0, span: 22 }}
						xl={{ offset: 0, span: 8 }}
						xxl={{ offset: 0, span: 8 }}>
						<Card title={L("bieu_do_ti_le_nguoi_dung_the_trong_nam") + " " + moment().format('YYYY')} className={'dashboardBox'} loading={pieChartLoading} bordered={false}>
							<PieChartExample
								childMemberCards={this.dashboard.childMemberCards}
								adultMemberCards={this.dashboard.adultMemberCards} />
						</Card>
					</Col>
				</Row>
			</Card>
		);
	}
}

export default Dashboard;
