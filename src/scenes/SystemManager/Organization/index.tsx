import * as React from "react";
import { Col, Row, Button, Tree, Card, Modal, message, TreeSelect } from 'antd';
import AppConsts, { cssCol, cssColResponsiveSpan } from "@src/lib/appconst";
import { DeleteFilled, DownOutlined, EditOutlined, FolderOutlined, PlusOutlined, TagsOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import { MoveOrganizationUnitInput, OrganizationUnitDto } from '@src/services/services_autogen';
import { TreeOrganizationDto } from "@src/stores/organizationStore";
import CreatOrUpdate from "./components/CreateOrganizationUnit";
import TabPanelOrganizationUnit from "./components/TabPanelOrganizationUnit";
import { L } from "@src/lib/abpUtility";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
const { TreeNode } = Tree

export default class Organization extends AppComponentBase {
    state = {
        isLoadDone: false,
        visibleModalFormOrganization: false,
        visibleModalCreateUpdate: false,
        selectedKeys: [],
        organization_parent_id: undefined,
        visibleModalTree: false,
        parent_id: undefined,
    };

    organizationSelected: OrganizationUnitDto = new OrganizationUnitDto();
    async componentDidMount() {
        const { treeOrganizationDto } = stores.organizationStore;
        await this.getAll()
        !!treeOrganizationDto ? this.setState({ visibleModalCreateUpdate: true }) : this.setState({ visibleModalCreateUpdate: false })
    }

    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.organizationStore.getAllOrganization();
        this.setState({ isLoadDone: true, visibleModalCreateUpdate: false });

    }
    createOrUpdateModalOpen = async (selectedKey: any, input: OrganizationUnitDto) => {
        this.organizationSelected.init(input);
        await this.setState({ visibleModalCreateUpdate: true, visibleModalFormOrganization: false, selectedKeys: [selectedKey], });
    }

    openTableForm = (selectedKey: any, value: OrganizationUnitDto) => {
        this.organizationSelected.init(value);
        if (value.parentId == null) {
            this.setState({ visibleModalFormOrganization: false })
        }
        else { this.setState({ visibleModalFormOrganization: true }) }
        this.setState({ visibleModalCreateUpdate: false, selectedKeys: [selectedKey] })
    }

    onCreateUpdateSuccess = async () => {
        await this.getAll();
    }

    deleteOrganization = async (value: OrganizationUnitDto) => {
        await stores.organizationStore.deleteOrganization(value);
        await this.onCreateUpdateSuccess();
    }
    loopTreeOrganization = (data: TreeOrganizationDto[]) => {
        return data.map((item, index) =>
            <TreeNode
                data={item}
                key={item.key + "_key"}
                title={
                    <div style={{ display: 'flex' }}>
                        <div onClick={() => { this.openTableForm(item.key + "_key", item) }}>
                            <span style={{ color: "black", fontSize: '16px' }}>{item.displayName}</span>
                            &nbsp;
                            <span style={{ fontStyle: " italic ", color: "gray", fontSize: "small" }}>
                                <>
                                    {item.parentId != null ? item.memberCount + " " + L('thanh_vien') + ", " + + item.roleCount + " " + L("chuc_vu") : ""}
                                </>
                            </span>
                        </div>
                        <div>
                            {item.parentId == null && <>
                                {this.isGranted(AppConsts.Permission.System_Organization_Create) &&
                                    <Button type='primary' style={{ marginLeft: '3px' }} icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", OrganizationUnitDto.fromJS({ parentId: item.id }))}></Button>
                                }
                                &nbsp;&nbsp;
                                {this.isGranted(AppConsts.Permission.System_Organization_Edit) &&
                                    <Button icon={<EditOutlined />} title={L("chinh_sua")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", item)} ></Button>
                                }
                            </>}
                            {(item.id > 0 && item.id == this.organizationSelected.id && this.state.visibleModalFormOrganization) && (
                                <>
                                    {this.isGranted(AppConsts.Permission.System_Organization_Create) &&
                                        <Button type='primary' style={{ marginLeft: '3px' }} icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", OrganizationUnitDto.fromJS({ parentId: item.id }))}></Button>
                                    }

                                    &nbsp;&nbsp;

                                    {this.isGranted(AppConsts.Permission.System_WebHookSubcription_Edit) &&
                                        <Button icon={<EditOutlined />} title={L("chinh_sua")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", item)} ></Button>
                                    }

                                    {item.parentId != null ?
                                        <>
                                            {this.isGranted(AppConsts.Permission.System_Organization_Move) &&
                                                <Button type='primary' style={{ marginLeft: '3px' }} icon={<TagsOutlined />} title={L("di_chuyen")} size="small" onClick={() => { this.setState({ visibleModalTree: true }); this.organizationSelected.init(item); }}></Button>
                                            }
                                            &nbsp;
                                            {this.isGranted(AppConsts.Permission.System_Organization_Delete) &&
                                                <Button danger icon={<DeleteFilled />} title={L("Delete")} size="small" onClick={() => { this.deleteOrganization(item) }} ></Button>
                                            }
                                        </>
                                        : ""}
                                </>
                            )}
                        </div>
                    </div>}>
                {(item.children && item.children.length) && this.loopTreeOrganization(item.children)}
            </TreeNode>
        );
    }

    onMoveItem = async (currentId: number, newParentId: number) => {
        await this.setState({ isLoadDone: false });
        let input = new MoveOrganizationUnitInput();
        input.id = currentId;
        input.newParentId = newParentId;
        if (input.id == input.newParentId) {
            message.error(L("khong_the_di_chuyen"));
            return;
        }
        await stores.organizationStore.moveOrganizationUnit(input);
        await this.getAll();
        message.success(L("thao_tac_thanh_cong"));
        await this.setState({ isLoadDone: true });
    }

    render() {
        const left = this.state.visibleModalCreateUpdate || this.state.visibleModalFormOrganization ? cssColResponsiveSpan(0, 0, 12, 12, 12, 12) : cssCol(24);
        const right = this.state.visibleModalCreateUpdate || this.state.visibleModalFormOrganization ? cssColResponsiveSpan(24, 24, 12, 12, 12, 12) : cssCol(0);
        const { treeOrganizationDto } = stores.organizationStore;
        return (
            <Card>
                <Row>
                    <h2 style={{ width: '100%', }}>{L("co_cau_to_chuc")}</h2>
                </Row>
                <Row>
                    <Col {...left}>
                        {treeOrganizationDto.id != undefined &&
                            <Tree
                                icon={<FolderOutlined />}
                                showLine
                                switcherIcon={<DownOutlined />}
                                selectedKeys={this.state.selectedKeys}
                                defaultExpandAll={true}
                            >
                                {this.loopTreeOrganization([treeOrganizationDto])}
                            </Tree>
                        }
                    </Col>
                    {this.state.visibleModalCreateUpdate &&
                        <Col {...right} style={{ marginTop: '15px' }}>
                            <CreatOrUpdate
                                onCreateUpdateSuccess={this.onCreateUpdateSuccess}
                                onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
                                organizationSelected={this.organizationSelected}
                                treeOrganization={[treeOrganizationDto]}
                            />
                        </Col>
                    }
                    {this.state.visibleModalFormOrganization &&
                        <Col {...right}>
                            <TabPanelOrganizationUnit
                                onCancel={() => this.setState({ visibleModalFormOrganization: false })}
                                organizationSuccess={this.onCreateUpdateSuccess}
                                organizationUnitDto={this.organizationSelected}
                            />
                        </Col>
                    }
                </Row>
                <Modal
                    visible={this.state.visibleModalTree}
                    onCancel={() => { this.setState({ visibleModalTree: false }) }}
                    title={L("di_chuyen")}
                    onOk={() => this.onMoveItem(this.organizationSelected.id, this.state.organization_parent_id!)}
                >
                    <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        defaultValue={this.organizationSelected.parentId}
                        treeData={[treeOrganizationDto]}
                        treeDefaultExpandAll
                        onSelect={async (value, node) => {
                            await this.setState({ organization_parent_id: node.id });
                        }}
                    />
                </Modal>
            </Card>
        )
    }
}