import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, Tabs, Modal } from 'antd';
import { L } from '@lib/abpUtility';
import { PlanDto, CreatePlanInput, UpdatePlanInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import PlanDetail from '../PlanDetail';
import { eProcess } from '@src/lib/enumconst';
import Contract from '../../Contract';
import TablePlanDetail from '../PlanDetail/components/TablePlanDetail';
import { ArrowLeftOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import DetailPlan from './DetailPlan';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (plan: PlanDto) => void;
	onCancel: () => void;
	planSelected: PlanDto;
}

export default class CreateOrUpdatePlan extends React.Component<IProps>{
	private formRef: any = React.createRef();
	private buttonRef: any = React.createRef();
	componentRef: any | null = null;


	state = {
		isLoadDone: false,
		idSelected: -1,
		keytab: "tab_plan_info",
		visiblePlanDetail: false,
		visibleContractDetail: false,
		// tab_plan_info key tab chỉnh sửa
	}
	planSelected: PlanDto;

	async componentDidMount() {
		this.initData(this.props.planSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.planSelected.pl_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.planSelected.pl_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.planSelected);
			await this.setState({ keytab: "tab_plan_info" });
		}
	}


	initData = async (inputmember: PlanDto | undefined) => {
		const { planSelected } = this.props;
		this.setState({ isLoadDone: false });
		if (inputmember != undefined) {
			this.planSelected = inputmember;
		} else {
			this.planSelected = new PlanDto();
		}
		if (this.planSelected.pl_id !== undefined) {
			if (planSelected.pl_process == eProcess.Creating.num || planSelected.pl_process == eProcess.Give_Back.num || planSelected.pl_process == eProcess.Cancel.num) {
				this.formRef.current!.setFieldsValue({
					... this.planSelected,
				});
			}
			await stores.planDetailStore.getAll(this.props.planSelected!.pl_id);
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { planSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (planSelected.pl_id === undefined || planSelected.pl_id < 0) {
				let unitData = new CreatePlanInput(values);
				await stores.planStore.createPlan(unitData);
				message.success(L("CreateSuccessfully"));
				this.formRef.current.resetFields();
			} else {
				let unitData = new UpdatePlanInput({ pl_id: planSelected.pl_id, ...values });
				await stores.planStore.updatePlan(unitData);
				message.success(L("EditSuccessfully"));
			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.planSelected);
		}

	}
	renderPlanDetail = (plan: PlanDto) => {
		if (plan.pl_id === undefined || plan.pl_id < 1) {
			return <></>
		}
		return <PlanDetail plan_selected={plan} onCancel={() => { this.onCancel() }} />;

	}

	isViewEdit = (process_status: number) => {
		if (process_status != eProcess.Creating.num && process_status != eProcess.Give_Back.num && process_status != eProcess.Cancel.num) {
			return false;
		}
		return true;
	}

	render() {
		const { planSelected } = this.props;
		const { planDetailListResult } = stores.planDetailStore;

		return (
			(planSelected.pl_process != eProcess.Complete.num && planSelected.pl_process != eProcess.Sign.num) ?
				<Card >
					{(planSelected == undefined || planSelected.pl_id == undefined) ?
						<Row style={{ alignContent: "left" }}>
							<Col span={18}>
								<Form ref={this.formRef}>
									<Form.Item label={this.state.idSelected === undefined ? L("CreatePlan") : L('EditPlan') + ": "} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'pl_title'}>
										<Input maxLength={AppConsts.maxLength.address} />
									</Form.Item>
								</Form>
							</Col>
							<Col span={6} style={{ textAlign: 'right' }}>
								<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
									{L('Cancel')}
								</Button>
								<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
									{L('Save')}
								</Button>
							</Col>
						</Row>
						:
						<Tabs activeKey={this.state.keytab} onTabClick={(value) => { this.setState({ keytab: value }) }}>
							<Tabs.TabPane tab={(
								<>
									<Button icon={<RollbackOutlined style={{ margin: '0' }} />}
										onClick={this.props.onCancel}
										style={{ marginRight: '5px' }}></Button>{L("PlanInfomation")}
								</>
							)} key="tab_plan_info">
								<Row style={{ alignContent: "left" }}>
									<Col span={18}>
										{this.isViewEdit(planSelected.pl_process) ?
											<Form ref={this.formRef}>
												<Form.Item label={this.state.idSelected === undefined ? L("CreatePlan") : L('EditPlan') + ": "} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'pl_title'}>
													<Input disabled={this.props.planSelected.pl_process == eProcess.Sign.num} />
												</Form.Item>
											</Form>
											: <h2>{L("Plan") + " " + planSelected.pl_title}</h2>
										}
									</Col>
									<Col span={6} style={{ textAlign: 'right' }}>

										{this.isViewEdit(planSelected.pl_process) ?
											<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
												{L('Save')}
											</Button> : ""}
									</Col>
								</Row>
								{this.renderPlanDetail(planSelected)}
							</Tabs.TabPane>

							<Tabs.TabPane tab={planSelected.pl_process == eProcess.Sign.num ? L("Contract") : ""} key="tab_contract_list" >
								<Contract isTitle={false} create={true} pl_id={planSelected.pl_id} onCancel={this.onCancel} is_redirect_billing={true} />
							</Tabs.TabPane>
						</Tabs>}
				</Card >
				:
				<Card>
					<Tabs activeKey={this.state.keytab} onTabClick={(value) => {
						this.setState({ keytab: value });
					}}
					>
						<Tabs.TabPane tab={<>
							<Button icon={<RollbackOutlined style={{ margin: '0' }} />}
								onClick={this.props.onCancel}
								style={{ marginRight: '5px' }}></Button>{L("PlanInfomation")}
						</>} key="tab_plan_info">

							<Col span={24} >
								<Row style={{ justifyContent: 'end' }}>
									<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visiblePlanDetail: true })}>{L('ExportData')}</Button>
								</Row>
								<Row style={{ justifyContent: 'center', }}>
									<h1 style={{ textTransform: 'uppercase' }}>{L('PurchasePlan') + ": " + planSelected.pl_title}</h1>
								</Row>
								<TablePlanDetail
									isLoadDone={this.state.isLoadDone}
									planDetailListResult={planDetailListResult}
									hasAction={false}
									isPrint={false}
									pagination={false}
								/>
								<DetailPlan
									planSelected={this.planSelected}
									visible={this.state.visiblePlanDetail}
									onCancel={() => this.setState({ visiblePlanDetail: false })}
								></DetailPlan>
							</Col>

						</Tabs.TabPane>

						<Tabs.TabPane tab={planSelected.pl_process != eProcess.Creating.num ? L("Contract") : ""} key="tab_contract_list" >
							<Contract isTitle={false} create={true} pl_id={planSelected.pl_id} onCancel={this.onCancel} is_redirect_billing={true} />
						</Tabs.TabPane>
					</Tabs>
				</Card >
		)
	}
}