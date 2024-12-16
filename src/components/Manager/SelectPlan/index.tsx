import * as React from 'react';
import {  Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { ContractStatus, PlanDto } from '@src/services/services_autogen';
import { eProcess } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
const { Option } = Select;

export interface IProps {
	onChangePlan?: (planDto: PlanDto) => void;
	pl_id?:number ;
	enum?:any;
}

export default class SelectPlan extends AppComponentBase<IProps> {
	state = {
		isLoading: true,
		pl_id: undefined,
	};

	async componentDidMount() {
		await this.setState({isLoading: true});
		await stores.planStore.getAll(undefined, undefined, undefined, undefined);
		if(this.props.pl_id != undefined){
			this.setState({pl_id:this.props.pl_id})
		}
		await this.setState({isLoading: false});
	}
	componentDidUpdate(prevProps) {
		if (this.props.pl_id !== prevProps.pl_id) {
			this.setState({ pl_id: this.props.pl_id });
		}
	}

	onChangePlan = async (pl_id: number) => {
		const { planListResult } = stores.planStore;
		await this.setState({pl_id:pl_id});

		if (planListResult.length > 0) {
			let planDto:PlanDto|undefined = planListResult.find((item) => item.pl_id == pl_id);
			if(planDto == undefined){
				planDto = new PlanDto();
			}
			if (!!this.props.onChangePlan) {
				this.props.onChangePlan(planDto);
			}
		}
	}

	componentWillUnmount() {
		this.setState = (state,callback)=>{
			return;
		};
	}
	render() {
		const { planListResult } = stores.planStore;
		return (
			<>
				<Select
					showSearch
					allowClear
					disabled={this.props.enum !=2 ? false : true}
					placeholder={L('Plan')}
					loading={this.state.isLoading}
					style={{ width: '100%' }}
					value={this.state.pl_id}
					onChange={async (value: number) => await this.onChangePlan(value)}
					filterOption={(input, option) => {
						let str = option!.props!.children! + "";
						return str.toLowerCase()!.indexOf(input.toLowerCase()) >= 0;
					}}
				>
					{planListResult.map((item:PlanDto,index:number) => (
						item.pl_process == eProcess.Sign.num &&<Option key={"key_completed_plan_" + index} value={item.pl_id!}>{item.pl_id + "." +item.pl_title}</Option>
					))}
				</Select>
			</>
		);
	}

}

