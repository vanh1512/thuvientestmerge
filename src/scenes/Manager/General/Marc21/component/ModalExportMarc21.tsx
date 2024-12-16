import * as React from 'react';
import { Col, Row, Button, Modal } from 'antd';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import { Marc21Dto } from '@src/services/services_autogen';
import TableMarc21 from './TableMarc21';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	marc21ListResult: Marc21Dto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportMarc21 extends React.Component<IProps> {
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
		const { marc21ListResult } = this.props;
		return (

			<Modal
				visible={this.props.visible}
				title={
					<Row >
						<Col span={12}>
							{L('xuat_danh_sach') + " " + L('Marc21')}
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={L('danh_sach_ma_marc21') + " " + moment().format("DD-MM-YYYY")}
								idPrint="marc_print"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L("huy")} style={{ margin: '0 26px 0 9px' }} danger onClick={() => { this.props.onCancel!() }}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => { this.props.onCancel!() }}
				footer={null}
				width='90vw'
				maskClosable={false}

			>
				<Row ref={this.setComponentRef} id='marc_print'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_ma_marc21")} </h1></Col>
					<Col span={24}>
						<TableMarc21
							marc21ListResult={marc21ListResult}
							pagination={false}
							isLoadDone={true}
							noscroll={true}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>
		)
	}
}