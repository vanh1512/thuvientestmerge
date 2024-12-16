import * as React from 'react';
import { Card, Row, Button, Tabs, Breadcrumb } from 'antd';
import { FilesOfUserDto, FolderDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import ListItemMove from './ListItemMove';
import { L } from '@src/lib/abpUtility';

export interface Iprops {
    folderSelected: FolderDto;
    fileSelected: FilesOfUserDto;
    onUpdateParent: (parentFolderId: number) => void;
}
export default class MoveItemFromFolder extends React.Component<Iprops> {
    state = {
        isLoadDone: false,
        link: undefined,
    };
    folderParent: FolderDto = new FolderDto();

    breadcrumb: FolderDto[] = [FolderDto.fromJS({ fo_id: -1, fo_name: 'Root' })];
    async componentDidMount() {
        await this.getAll();
    }
    getAll = async () => {
        this.setState({ isLoadDone: false });
        await stores.resourseStore.getResoundByLink(this.state.link);
        const fo_id_parent = this.props.fileSelected.fi_us_id != undefined ? this.props.fileSelected.fo_id : this.props.folderSelected.fo_id_parent;
        this.folderParent = await stores.resourseStore.getFolderById(fo_id_parent);
        this.setState({ isLoadDone: true });
    }
    onChangeFolder = async (folder: FolderDto, isPushBR?: boolean) => {
        let link = folder.fo_link;
        if (folder.fo_link == null) {
            link = undefined;
        }
        await this.setState({ link: link });

        if (isPushBR == true) {
            this.breadcrumb.push(folder);
        }
        await this.onUpdateParent();
        await this.getAll();
    }
    onChangeBreadcrumb = async (folder: FolderDto) => {
        let index: number = this.breadcrumb.findIndex(item => item.fo_id == folder.fo_id);
        this.breadcrumb.splice(index, this.breadcrumb.length);
        await this.onChangeFolder(folder, true);
        this.setState({ isLoadDone: true });
    }

    onUpdateParent = async () => {
        this.setState({ isLoadDone: false });
        if (this.breadcrumb[this.breadcrumb.length - 1] != undefined) {
            if (this.props.onUpdateParent != undefined) {
                this.props.onUpdateParent(this.breadcrumb[this.breadcrumb.length - 1].fo_id);
            }
        }
        this.setState({ isLoadDone: true });
    }

    render() {
        const { fileSelected, folderSelected } = this.props;
        const { resourseSelect } = stores.resourseStore;
        const foldersInside = resourseSelect.foldersInside != undefined ? resourseSelect.foldersInside : [];
        const filesInside = resourseSelect.filesInside != undefined ? resourseSelect.filesInside : [];
        const name = fileSelected.fi_us_id != undefined ? fileSelected.fi_us_name : folderSelected.fo_name;
        return (
            <Card>
                <Row>
                    <h2>{L("Move") + " "  + `"` +  name + `"`}</h2>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                    <span>{L('CurrentPosition')}:</span>&nbsp;&nbsp;<Button onClick={() => this.onChangeFolder(this.folderParent)}>{this.folderParent.fo_name}</Button>
                </Row>
                <Breadcrumb separator="/" >
                    {this.breadcrumb.map((item: FolderDto, index: number) =>
                        <Breadcrumb.Item key={"breadcrumb_key_" + index} onClick={() => this.onChangeBreadcrumb(item)}>{item.fo_name}</Breadcrumb.Item>
                    )}
                </Breadcrumb>
                <Tabs>
                    <Tabs.TabPane tab={L("Propose")} key="item-1">
                        <ListItemMove folderSelected={folderSelected} foldersInside={foldersInside} filesInside={filesInside} onChangeFolder={this.onChangeFolder} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={L("Starred")}key="item-2">
                        {L("Starred")}
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        )
    }
}