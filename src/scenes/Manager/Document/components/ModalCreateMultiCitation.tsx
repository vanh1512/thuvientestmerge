import * as React from 'react';
import { Col, Row, Button, Card, Form, message, Modal } from 'antd';
import { L } from '@lib/abpUtility';
import { CitationDto, CreateListCitationInput, CreateOrUpdateCitationInput, DocumentDto, ItemDocument } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import rules from '@src/scenes/Validation';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eCitationStructure, eCitationType } from '@src/lib/enumconst';
import Table, { ColumnsType } from 'antd/lib/table';

export interface IProps {
    onCreateUpdateSuccess?: () => void;
    onCancel?: () => void;
    visible: boolean;
    documentListSelected?: DocumentDto[];
}

export default class ModalCreateOrUpdateMultiCitation extends React.Component<IProps>{
    private formRef: any = React.createRef();
    state = {
        isLoadDone: false,
        ci_type: undefined,
        ci_structure: undefined,
    }
    itemDocument: ItemDocument[] = [];
    async componentDidMount() {
        await this.getItemDocument();
    }
    getItemDocument = () => {
        this.setState({ isLoadDone: false });
        const { documentListSelected } = this.props;
        documentListSelected!.map(item => {
            let data = new ItemDocument();
            data.id = item.do_id;
            data.name = item.do_title;
            this.itemDocument.push(data);
        })
        this.setState({ isLoadDone: true });
    }
    onCreateUpdate = () => {
        const { documentListSelected } = this.props;
        const form = this.formRef.current;
        form!.validateFields().then(async (values: any) => {
            this.setState({ isLoadDone: false });
            let inputData = new CreateListCitationInput();
            inputData.itemDocument = this.itemDocument!;
            inputData.ci_type = this.state.ci_type!;
            inputData.ci_structure = this.state.ci_structure!;
            await stores.citationStore.createOrUpdateMultiCitation(inputData);
            await this.onCreateUpdateSuccess();
            message.success(L("them_moi_thanh_cong"))
            this.setState({ isLoadDone: true });
        })
    };
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }

    }
    onCreateUpdateSuccess = () => {
        if(!!this.props.onCreateUpdateSuccess)
        {this.props.onCreateUpdateSuccess()}
    }


    render() {
        const self = this;
        const { documentListSelected, visible } = this.props;
        const columns: ColumnsType<DocumentDto> = [
            { title: L('stt'), key: 'no_Supplier_index', fixed: 'left', width: 50, render: (text: string, item: DocumentDto, index: number) => <div>{index + 1}</div> },
            { title: L('Identifier'), key: 'do_identifier', className: 'no-print', render: (text: string, item: DocumentDto) => <div>{item.do_identifier}</div> },
            { title: L('ten_tai_lieu'), key: 'cpi_month_Supplier_index', className: "no-print", render: (text: string, item: DocumentDto) => <div>{item.do_title}</div> },
        ];
        return (
            <Modal visible={visible}
                title={
                <Row>
                    <Col span={12}><h2>{L('them_moi_trich_dan')}</h2></Col>
                    <Col span={12}>
                    <Row style={{ marginTop: 10}} justify='end' >
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
                                        {L('Cancel')}
                                    </Button>
                                    <Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
                                        {L('Save')}
                                    </Button>
                                </Col>
                            </Row>
                    </Col>
                </Row>
                
            }
                footer={false}
                width={"80%"}
                closable={false}
            >
                <>
                    <Row>
                        <Col span={12}>
                            <h2>{L("Danh_sach_tai_lieu")}</h2>
                            <Table
                                className='centerTable page-break'
                                rowKey={record => record.do_id}
                                size={'middle'}
                                bordered={true}
                                locale={{ "emptyText": L('NoData') }}
                                columns={columns}
                                dataSource={(documentListSelected !== undefined) ? documentListSelected : []}
                                pagination={false}
                                scroll={{y:400,x:undefined}}
                            />
                        </Col>
                        <Col span={12}>
                            <h2>{L("them_moi")}</h2>
                            <Row style={{ marginTop: 10 }}>
                                <Form ref={this.formRef} style={{ width: "100%" }}>
                                    <Form.Item label={L("kieu_trich_dan")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ci_type'}>
                                        <SelectEnum eNum={eCitationType} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ ci_type: value }); await this.setState({ ci_type: value }) }} />
                                    </Form.Item>
                                    <Form.Item label={L("cau_truc_trich_dan")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ci_structure'}>
                                        <SelectEnum eNum={eCitationStructure} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ ci_structure: value }); await this.setState({ ci_structure: value }) }} />
                                    </Form.Item>
                                </Form>
                            </Row>
                        </Col>
                    </Row>
                </ >
            </Modal>
        )
    }
}