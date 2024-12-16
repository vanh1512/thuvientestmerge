import * as React from 'react';
import { Col, Row, Button, Card, Form, Table, Typography, Popconfirm, message, Input, InputNumber } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BillingDto, BillingItemDto, CreateBillingItemInput, PlanDetailDto, UpdateBillingItemInput } from '@services/services_autogen';
import { EditableCell } from './components/TableMainBillingItem';
import { EditOutlined, PlusCircleOutlined, RestOutlined, StepBackwardOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import { ePlanDetailStatus } from '@src/lib/enumconst';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	billingItem: BillingDto;
	planDetailList: PlanDetailDto[];
	onCreateUpdateSuccess: () => void;
}
export default class BillingItem extends React.Component<IProps> {
	private form: any = React.createRef();

	state = {
		isLoadDone: true,
		editingKey: -1,
		bi_it_name: '',
		bi_it_amount: undefined,
		bi_it_cost: undefined,
		bi_it_unit: '',
	};
	async componentDidMount() {
		await this.getAll();

	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.billingItem!.bi_id !== prevProps.billingItem.bi_id) {
			await this.getAll();
		}
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.billingItemStore.getAll(this.props.billingItem.bi_id, undefined, undefined);
		this.setState({ isLoadDone: true });
	}

	onCreateBillingItem = async (pl_de_id?: number) => {
		try {
			this.setState({ isLoadDone: false });
			const { billingItemListResult } = stores.billingItemStore;
			// check xem đã có hóa đơn con chưa, nếu có thì được tạo
			if (!!pl_de_id) {
				const bi_it_existed = billingItemListResult.find(item => item.pl_de_id == pl_de_id);
				const billingItem = await stores.billingItemStore.checkPlanDetailHasBilling(pl_de_id, this.props.billingItem.bi_id);
				if (!!bi_it_existed && !!billingItem && bi_it_existed.pl_de_id == billingItem.pl_de_id) {
					message.error(L('da_co_hoa_don_con'));
					return;
				}
			}
			const lastItem = billingItemListResult[billingItemListResult.length - 1];
			if (lastItem == undefined) {
				let unitData = new CreateBillingItemInput();
				unitData.bi_id = this.props.billingItem.bi_id;
				unitData.pl_de_id = pl_de_id ? pl_de_id : -1;
				let result = await stores.billingItemStore.createBillingItem(unitData);
				await this.setState({
					editingKey: (await result).bi_it_id, bi_it_name: result.bi_it_name, bi_it_cost: result.bi_it_cost,
					bi_it_amount: result.bi_it_amount, bi_it_unit: result.bi_it_unit
				});
			}
			else if (
				!!lastItem.bi_it_name &&
				lastItem.bi_it_name.trim() !== '' &&
				!!lastItem.bi_it_unit &&
				lastItem.bi_it_unit.trim() !== ''
			) {
				let unitData = new CreateBillingItemInput();
				unitData.bi_id = this.props.billingItem.bi_id;
				unitData.pl_de_id = pl_de_id ? pl_de_id : -1;
				let result = await stores.billingItemStore.createBillingItem(unitData);
				// await this.form.current!.setFieldsValue({ ...result });
				await this.setState({
					editingKey: (await result).bi_it_id, bi_it_name: result.bi_it_name, bi_it_cost: result.bi_it_cost,
					bi_it_amount: result.bi_it_amount, bi_it_unit: result.bi_it_unit
				});
			} else {
				message.error(L('hay_nhap_du_truong'));
				return;
			}
			this.setState({ isLoadDone: true });
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	onEditBillingItem = async (record: BillingItemDto) => {
		try {
			if (
				!!this.state.bi_it_name &&
				this.state.bi_it_name.trim() != '' &&
				!!this.state.bi_it_unit &&
				this.state.bi_it_unit.trim() != ''

			) {
				const data = this.props.planDetailList.find(item => item.pl_de_id == record.pl_de_id);
				let unitData = new UpdateBillingItemInput();
				unitData.bi_it_id = this.state.editingKey;
				unitData.bi_it_name = this.state.bi_it_name ?? record.bi_it_name;
				unitData.bi_it_amount = this.state.bi_it_amount!;
				unitData.bi_it_cost = this.state.bi_it_cost! ?? record.bi_it_cost;
				unitData.bi_it_unit = this.state.bi_it_unit ?? record.bi_it_unit;
				await stores.billingItemStore.updateBillingItem(unitData);
				await this.setState({
					editingKey: -1, bi_it_name: undefined, bi_it_cost: undefined,
					bi_it_amount: undefined, bi_it_unit: undefined
				});
				message.success(L("EditSuccessfully"));
				if (!!this.props.onCreateUpdateSuccess) {
					this.props.onCreateUpdateSuccess();
				}
			} else {
				message.error(L('hay_nhap_du_truong'));
				return;
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};
	onDeleteBillingItem = async (bi_it_id: number) => {
		this.setState({ isLoadDone: false });
		await stores.billingItemStore.deleteBillingItem(bi_it_id);
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
		this.setState({
			isLoadDone: true, editingKey: -1, bi_it_name: undefined, bi_it_cost: undefined,
			bi_it_amount: undefined, bi_it_unit: undefined
		});

	};
	isEditing = (record: BillingItemDto) => record.bi_it_id === this.state.editingKey;

	edit = async (record: Partial<BillingItemDto> & { bi_it_id: React.Key }) => {
		if (this.state.editingKey != -1) {
			message.error(L('hay_luu_dong_du_lieu_hien_tai'));
			return;
		}
		await this.setState({
			editingKey: record.bi_it_id,
			bi_it_name: record.bi_it_name, bi_it_cost: record.bi_it_cost, bi_it_amount: record.bi_it_amount, bi_it_unit: record.bi_it_unit
		});

	};
	delete = (record: Partial<BillingItemDto> & { bi_it_id: React.Key }) => {
		if (this.state.editingKey != -1) {
			message.error(L('ban_chua_thuc_hien_chinh_sua_xong'));
			return;
		}

		this.form.current!.setFieldsValue({ ...record });
		this.setState({ editingKey: record.bi_it_id });
	};
	cancel = async (record: BillingItemDto) => {
		if (
			!!record.bi_it_name &&
			record.bi_it_name.trim() !== '' &&
			!!record.bi_it_unit &&
			record.bi_it_unit.trim() !== ''
		) {
			await this.setState({
				editingKey: -1, bi_it_name: undefined, bi_it_cost: undefined,
				bi_it_amount: undefined, bi_it_unit: undefined
			});
		} else {
			message.error(L('hay_nhap_du_truong'));
			return;
		}

	};
	calculateTotal = () => {
		let total = 0;
		const { billingItemListResult } = stores.billingItemStore;
		billingItemListResult.map((row) => {
			total += row.bi_it_cost * row.bi_it_amount || 0;
		});
		return total;
	};
	handleInputChangeName = (e) => {
		const inputValue = e.target.value;
		this.setState({
			bi_it_name: inputValue,
		});
	};
	componentWillUnmount() {
		const { billingItemListResult } = stores.billingItemStore;
		billingItemListResult.map(async item => {
			if (
				!item.bi_it_name ||
				item.bi_it_name.trim() == '' ||
				!item.bi_it_unit ||
				item.bi_it_unit.trim() == ''
			) {
				await stores.billingItemStore.deleteBillingItem(item.bi_it_id);
			}
		})
	}
	render() {
		const { billingItemListResult } = stores.billingItemStore;
		const columns: any = [
			{ title: L('N.O'), width: 50, dataIndex: '', key: 'no_bill_table', render: (text: string, item: BillingItemDto, index: number) => <div>{index + 1}</div>, },
			{
				title: L('NameBill'), dataIndex: 'bi_it_name', key: 'bi_it_name', required: true,
				render: (text: string, item: BillingItemDto, index: number) =>
					<div>{(this.state.editingKey == item.bi_it_id && item.pl_de_id == -1) ?
						<>

							<Input maxLength={AppConsts.maxLength.language} defaultValue={item.bi_it_name} onChange={this.handleInputChangeName} />
							&nbsp;&nbsp;

						</>
						: item.bi_it_name} </div>
			},
			{
				title: L('Price'), dataIndex: 'bi_it_cost', key: 'bi_it_cost', editable: true, required: true, render: (text: string, item: BillingItemDto, index: number) =>
					<div>{this.state.editingKey == item.bi_it_id ?
						<InputNumber min={0} defaultValue={item.bi_it_cost} onChange={(e) => this.setState({ bi_it_cost: e })} formatter={a => AppConsts.numberWithCommas(a)}
							parser={a => a!.replace(/\$s?|(,*)/g, '')} />
						: item.bi_it_cost} </div>
			},
			{
				title: L('Quantity'), width: 100, dataIndex: 'bi_it_amount', key: 'bi_it_amount', editable: true, required: true,
				render: (text: string, item: BillingItemDto, index: number) =>
					<div>{this.state.editingKey == item.bi_it_id ?
						<InputNumber min={0} formatter={a => AppConsts.numberWithCommas(a)}
							parser={a => a!.replace(/\$s?|(,*)/g, '')} defaultValue={item.bi_it_amount} onChange={(e) => this.setState({ bi_it_amount: e })} />
						: item.bi_it_amount} </div>
			},
			{
				title: L('Unit'), dataIndex: 'bi_it_unit', key: 'bi_it_unit', editable: true, required: true,
				render: (text: string, item: BillingItemDto, index: number) =>
					<div>{this.state.editingKey == item.bi_it_id ?
						<>

							<Input defaultValue={item.bi_it_unit} onChange={(e) => this.setState({ bi_it_unit: e.target.value })} />

						</>
						: item.bi_it_unit} </div>
			},
			{
				title: "",
				dataIndex: 'Action',
				fixed: 'right',
				width: 50,
				render: (_: any, record: BillingItemDto) => {
					const da_nhap_kho = this.props.planDetailList.find(item => item.pl_de_id == record.pl_de_id)?.pl_de_status;
					const editable = this.isEditing(record);
					return da_nhap_kho == ePlanDetailStatus.da_nhap_kho.num ? ""
						:
						editable ? (
							<span>
								<Typography.Link onClick={() => this.onEditBillingItem(record)} style={{ marginRight: 8 }}>
									{L("Save")}
								</Typography.Link>
								{(
									!record.bi_it_name ||
									record.bi_it_name.trim() == '' ||
									!record.bi_it_unit ||
									record.bi_it_unit.trim() == ''
								) ? <Popconfirm title={L('AreYouSureWantToDelete')} onConfirm={() => this.onDeleteBillingItem(record.bi_it_id)}>
									<RestOutlined style={{ color: 'red' }} />
								</Popconfirm> :
									<Popconfirm title={L('AreYouSureWantToCancel')} onConfirm={() => this.cancel(record)}>
										<a style={{ color: 'red' }}>{L("Cancel")}</a>
									</Popconfirm>
								}
							</span>
						) : (
							<>
								<Typography.Link onClick={() => this.edit(record)}>
									<EditOutlined />
								</Typography.Link>
								&nbsp;&nbsp;
								{/* {record.pl_de_id < 0 && */}
								<Popconfirm title={L('AreYouSureWantToDelete')} onConfirm={() => this.onDeleteBillingItem(record.bi_it_id)}>
									<RestOutlined style={{ color: 'red' }} />
								</Popconfirm>
								{/* } */}
							</>
						);
				},
			},
		];
		// const mergedColumns = columns.map(col => {
		// 	console.log("aaaa", col);

		// 	if (!col.editable) {
		// 		return col;
		// 	}
		// 	return {
		// 		...col,
		// 		onCell: (record: BillingItemDto) => ({
		// 			record,
		// 			inputType: (col.dataIndex === 'bi_it_cost' || col.dataIndex === 'bi_it_amount') ? 'number' : (col.dataIndex == 'bi_it_note') ? "note" : 'text',
		// 			dataIndex: col.dataIndex,
		// 			required: col.required,
		// 			title: col.title,
		// 			editing: this.isEditing(record),
		// 		}),
		// 	};
		// });
		return (
			<Card >
				<Col span={24} style={{ overflowY: "auto", overflowX: "hidden" }}>
					<h3>{L('BillingItem')}</h3>
					<Table
						scroll={{ x: 700 }}
						rowKey={record => "billing_item_index__" + JSON.stringify(record)}
						rowClassName={(record, index) => (this.state.editingKey == record.bi_it_id) ? "bg-click" : "bg-white"}
						components={{
							body: {
								cell: EditableCell,
							},
						}}
						onRow={(record, rowIndex) => {
							return {
								onDoubleClick: (event: any) => { this.edit(record) }
							};
						}}
						bordered
						size='small'
						dataSource={[...billingItemListResult]}
						columns={columns}
						pagination={false}
						footer={() => (
							<div style={{ display: 'flex' }}>
								<Col span={13} ><strong>{L("Tot")}</strong> </Col>
								<Col span={11} style={{ marginLeft: '10px' }}><strong>{this.calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong> </Col>
							</div>
						)}
					/>
					<Row>
						<Col span={24} style={{ textAlign: 'center' }}>
							<Button icon={<PlusCircleOutlined />} type='primary' title={L('Create')} onClick={() => this.onCreateBillingItem()}></Button>
						</Col>
					</Row>
				</Col>
			</Card>
		)
	}
}