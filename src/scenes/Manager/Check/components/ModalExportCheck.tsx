import * as React from 'react';
import { Col, Row, Button, Modal } from 'antd';
import { CheckDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainCheck from './TableMainCheck';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	checkListResult: CheckDto[],

	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportCheck extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isHeaderReport: false,
		visibleModalCreateUpdate: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { checkListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportCheckList')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={L('danh_sach_kiem_ke') + " " + moment().format("DD-MM-YYYY")}
								idPrint="Check_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => { this.props.onCancel!(); }}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				cancelButtonProps={{ style: { display: "none" } }}
				footer={null}
				width='90vw'
				onCancel={() => { this.props.onCancel!() }}
				maskClosable={true}
			>
				<Row id='Check_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_KIEM_KE")}</h2></Col>
					<Col span={24}>
						<TableMainCheck
							checkListResult={checkListResult}
							pagination={false}
							scroll={true}
							noscroll={true}
							is_printed={true}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>
		)
	}
}