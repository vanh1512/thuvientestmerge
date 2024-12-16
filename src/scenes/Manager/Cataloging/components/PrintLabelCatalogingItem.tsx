import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row, message } from 'antd';
import ActionExport from '@src/components/ActionExport';
import LabelBook from '../../Buy/CatalogingRecord/components/LabelBook';
import { L } from '@src/lib/abpUtility';
import { ItemLabel } from '../../DocumentInfor/components/PrintLabelDocumentInfor';
import { CatalogingDto } from '@src/services/services_autogen';
import AppConsts from '@src/lib/appconst';

export interface IProps {
    visible: boolean;
    cataSelected: CatalogingDto;
    onCancel: () => void;
}
export default class PrintLabelCatalogingItem extends React.Component<IProps> {
    componentRef: any | null = null;
    itemLabel: ItemLabel = new ItemLabel();
    state = {
        isLoadDone: true,
    }

    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    componentDidMount() {
        this.initData();
    }
    initData = () => {
        const { cataSelected } = this.props;
        if (cataSelected != undefined && cataSelected.cata_id != undefined) {
            this.setState({ isLoadDone: false });
            this.itemLabel.ma_1 = (cataSelected.cata_resultDDC != "" && JSON.parse(cataSelected.cata_resultDDC!)["082"].subfields != undefined && JSON.parse(cataSelected.cata_resultDDC!)["082"].subfields.find(item => "$a" in item) != undefined) ? JSON.parse(cataSelected.cata_resultDDC!)["082"].subfields.find(item => "$a" in item).$a : "";
            this.itemLabel.ma_2 = (cataSelected.cata_resultTitle != "" && JSON.parse(cataSelected.cata_resultTitle!)["245"].subfields != undefined && JSON.parse(cataSelected.cata_resultTitle!)["245"].subfields.find(item => "$a" in item) != undefined) ? AppConsts.titleEncode(JSON.parse(cataSelected.cata_resultTitle!)["245"].subfields.find(item => "$a" in item).$a) : "";
            this.itemLabel.dkcb_code = cataSelected.dkcb_code!;

            this.setState({ isLoadDone: true });
        }
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                title={
                    <Row gutter={16} justify='space-between'>
                        <Col >{L('PrintLabel')}</Col>
                        <Col >
                            <ActionExport
                                nameFileExport='Label book'
                                idPrint="label_book_id"
                                isExcel={false}
                                isWord={false}
                                componentRef={this.componentRef}
                            />&nbsp;
                            <Button danger onClick={this.onCancel}>{L("Cancel")}</Button>
                        </Col>
                    </Row>
                }
                onCancel={this.onCancel}
                footer={null}
                width='40vw'
                maskClosable={false}
                closable={false}
            >
                {this.itemLabel.dkcb_code != undefined ?
                    <Row ref={this.setComponentRef} id={"label_book_id"} style={{ width: "55%", marginRight: "auto", marginLeft: "auto" }}>
                        <LabelBook itemLabel={this.itemLabel} />

                    </Row>
                    :
                    <b>{L("khong_co_ma_dkcb")}</b>
                }
            </Modal>
        )

    }
}