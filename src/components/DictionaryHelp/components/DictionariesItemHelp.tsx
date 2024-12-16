import * as React from 'react';
import { Col, Image, Row, } from 'antd';
import { DictionariesDto, } from '@services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';


export interface IProps {
	dictionariesItemListResult: DictionariesDto[],
}
export default class DictionariesItemHelp extends AppComponentBase<IProps> {
	state = {
		dic_id_selected: -1,
	}

	render() {
		const { dictionariesItemListResult } = this.props;
		return (
			<Row>
				{dictionariesItemListResult.map((item: DictionariesDto, index: number) =>
					<Row key={"dictionary_help_" + index}>
						<Col span={9} style={{ textAlign: 'center' }}>
							<Image width={"80%"} src={item.fi_id_symbol.id!=0?this.getFile(item.fi_id_symbol.id):process.env.PUBLIC_URL + "/icon_file_sample/no_image.png"} />
						</Col>
						<Col span={15} style={{ width: "20vw" }}>
							<Row><b>{item.dic_name}</b></Row>
							<Row>{L("Description") + ": "}&nbsp;<b><div dangerouslySetInnerHTML={{ __html: item.dic_short_des! }}></div></b></Row>
							<Row>{L('Detail') + ": "} &nbsp;<b><div dangerouslySetInnerHTML={{ __html: item.dic_desc! }}></div></b></Row>
							<Row >{L("MoreInfomation") + ": "} &nbsp;<u><i style={{ color: "#096dd9", cursor:"pointer" }} onClick={() => window.open(item.dic_ref)}>{item.dic_ref}</i></u></Row>
						</Col>
						<Col span={24}><hr style={{ width: '90%' }}></hr></Col>
					</Row>
				)}
			</Row>
		)
	}
}