import * as React from 'react';
import { Col, Row, Card, Avatar, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { L } from '@lib/abpUtility';
import { valueOfeFolderAction } from '@src/lib/enumconst';
import moment from 'moment';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

export interface IProps {
	fi_fo_id: number,
	fi_fo_name?: string,
	isFile: boolean;
}

export default class FileOrFolderLog extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelFolderLog: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		fi_fo_selected: undefined,
	};
	async componentDidMount() {
		await this.getAll();
	}
	async componentDidUpdate(prevProps) {
		if (this.props.fi_fo_id !== prevProps.fi_fo_id) {
			await this.getAll();
		}
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.fileOrFolderLogStore.getAll(this.props.fi_fo_id, this.props.isFile, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}
	render() {
		const { fileOrFolderLogListResult } = stores.fileOrFolderLogStore;

		return (
			<Card style={{ overflow: 'auto', height: '400px' }}>
				<Row gutter={16}>
					<Col span={12} >
						<h3>{L('Work')}</h3>
					</Col>
				</Row>
				{
					fileOrFolderLogListResult !== undefined && fileOrFolderLogListResult.map(item =>
						<Row key={"fileorfolder_" + item.fi_fo_id} gutter={32} style={{ marginBottom: '10px' }}>
							<Col>
								<Avatar shape="circle" src={this.getFile(stores.sessionStore.getUserLogin().us_avatar)} />
							</Col>
							<Col>
								<Row>
									{stores.sessionStore.getUserNameById(item.us_id)} đã {item.fi_fo_lo_data}
								</Row>
								<Row style={{ fontSize: '11px' }}>
									{moment(item.fi_fo_lo_created_at).format("HH:mm:ss DD/MM/YYYY")}
								</Row>
								<Row justify='center' >
									<div style={{ border: '1px solid black', borderRadius: '5px', padding: '5px' }}>
										{this.props.fi_fo_name}
									</div>
									{/* {valueOfeFolderAction(item.fi_fo_lo_action)} */}
								</Row>
							</Col>
						</Row>
					)
				}
			</Card>
		)
	}
}