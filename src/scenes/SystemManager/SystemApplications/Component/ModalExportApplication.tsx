import { ApplicationExtDto } from "@src/services/services_autogen";
import * as React from "react";
import TableApplications from "./TableApplications";
import { Button, Col, Modal, Row } from "antd";
import { L } from "@src/lib/abpUtility";
import ActionExport from "@src/components/ActionExport";
import moment from "moment";
import HeaderReport from "@src/components/LayoutReport/HeaderReport";
import FooterReport from "@src/components/LayoutReport/FooterReport";

export interface IProps {
	applicationListResult: ApplicationExtDto[],
	onCancel?: () => void;
	visible: boolean;
}

export default class ModalExportApplication extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { applicationListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							{L("xuat_danh_sach") + " " + L("ung_dung")}
						</Col>
						<Col span={12} style={{ textAlign: "end" }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={L('danh_sach_ung_dung') + " " + moment().format("DD-MM-YYYY")}
								idPrint='application_print_id'
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('huy')} style={{ margin: '0 26px 0 9px' }} danger onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={this.props.onCancel}
				footer={null}
				width="90vw"
				maskClosable={false}
			>
				<div ref={this.setComponentRef} id='application_print_id'>
				{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<h2 style={{ textAlign: 'center' }}>{L('danh_sach_ung_dung')}</h2>
					<TableApplications
						applicationListResult={applicationListResult}
						isLoadDone={true}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</div>
			</Modal>
		)
	}
}