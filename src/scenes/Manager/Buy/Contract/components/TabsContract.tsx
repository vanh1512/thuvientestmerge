import * as React from 'react';
import { Button, Card, Tabs } from 'antd';
import { ContractDto, } from '@services/services_autogen';
import { enumContracStatus } from '@src/lib/enumconst';
import Billing from '../../Billing';
import Receipt from '../../Receipt';
import CreateOrUpdateContract from './CreateOrUpdateContract';
import { L } from '@src/lib/abpUtility';

export interface IProps {
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	contractSelected: ContractDto;
	pl_id: number;
	allow_editted?: boolean;
}

export default class TabsContract extends React.Component<IProps>{

	state = {
		isLoadDone: false,
	}
	contractSelected: ContractDto;

	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}

	render() {
		const { contractSelected, pl_id, allow_editted } = this.props;
		return (
			<>
				<Tabs tabBarExtraContent={<Button danger title={L("Cancel")} onClick={() => this.onCancel()}>{L("Cancel")}</Button>}>
					<Tabs.TabPane key={'info_contract'} tab={L('Infomation')}>
						<CreateOrUpdateContract
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							contractSelected={contractSelected}
							pl_id={pl_id}
							allow_editted={allow_editted}
						/>
					</Tabs.TabPane>
					{contractSelected.co_id != undefined &&
						<>
							<Tabs.TabPane key={'billingItem'} tab={L('Bill')}>
								<Billing
									allow_editted={allow_editted}
									co_id={contractSelected.co_id}
									contractSelected={contractSelected}
									changeStatus={this.onCreateUpdateSuccess}
								/>
							</Tabs.TabPane>
							{/* <Tabs.TabPane key={'receipt'} tab={L('Receipt')}>
								<Receipt
									contractSelected={contractSelected}
									allow_editted={allow_editted}
								/>
							</Tabs.TabPane> */}
						</>
					}
				</Tabs>
			</ >
		)
	}
}