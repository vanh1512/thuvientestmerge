import * as React from 'react';
import Barcode from 'react-barcode';
import { ItemLabel } from './PrintLabel';

export interface IProps {
	itemLabel:ItemLabel ;
}

export default class LabelBook extends React.Component<IProps> {
	render() {
		const itemLabel = this.props.itemLabel != undefined ? this.props.itemLabel : new ItemLabel();
		return (
			<div style={{ width: "90%",fontSize:'17px',border:'1px solid black',paddingBottom:"5px" }}  >
				<div style={{ textAlign: 'center' }}>
					<b>{itemLabel.ma_1}</b>
				</div>
				<div style={{ textAlign: 'center'}}>
					<b>{itemLabel.ma_2}</b>
				</div>
				<div style={{ textAlign: 'center' }}>
					<Barcode value={itemLabel.dkcb_code} displayValue={true} fontSize={20} width={0.65}  height={50} />
				</div>
			</div>
		)
	}
}