import * as React from 'react';
import { Card, Col, Row } from 'antd';
import LabelBook from './LabelBook';
import ActionExport from '@src/components/ActionExport';
import { cssColResponsiveSpan } from '@src/lib/appconst';

export class ItemLabel {
	ma_1: string;
	ma_2: string;
	dkcb_code: string;
}

export interface IProps {
	listLabel: ItemLabel[];
}

export default class PrintLabel extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}

	render() {

		return (
			<Card>
				{this.props.listLabel != undefined && this.props.listLabel.length > 0 &&
					<>
						<Col style={{ textAlign: 'right', marginBottom: '10px', marginRight: '10px' }}>
							<ActionExport
								nameFileExport='Label book'
								idPrint="label_book_id"
								isExcel={false}
								isWord={false}
								componentRef={this.componentRef}
							/>
						</Col>
						{this.props.listLabel != undefined && this.props.listLabel.length > 0 &&
							<div id={"label_book_id"} ref={this.setComponentRef} style={{ boxSizing: 'border-box' }}>
								<div style={{ width: "100%", display: "flex", flexWrap: "wrap", boxSizing: 'border-box' }}>
									{this.props.listLabel != undefined && [...this.props.listLabel].map(item =>
										<div id={'labelClass'} className='page-break' key={"labelClass" + item.dkcb_code} style={{ width: "24%", marginLeft: '3px', marginBottom: '5px' }} >
											<LabelBook itemLabel={item} />
										</div>
									)}
								</div>	
							</div>}
					</>
				}
			</Card>
		)
	}
}