import * as React from 'react';
import { Card, Input, } from 'antd';
import { FilesOfUserRolesDto, FolderDto, FolderRolesDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';
import AppConsts from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';

export interface Iprops {
	desc: string;
	onSaveDesc: (desc: string) => void;
	fileRolesSelected: FilesOfUserRolesDto;
	folderRolesSelected: FolderRolesDto;
	onCancel: () => void;
}
export default class DetailItemRoles extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
		desc: "",
	};
	folderParent: FolderDto;
	async componentDidMount() {
		await this.setState({ isLoading: true });
		if (this.props.desc != undefined) {
			this.setState({ desc: this.props.desc })
		}
		await this.setState({ isLoading: false });
	}
	async componentDidUpdate(prevProps) {
		if (this.props.desc !== prevProps.desc) {
			this.setState({ desc: this.props.desc });
		}
		const fo_id_parent = this.props.fileRolesSelected.fi_us_id != undefined ? this.props.fileRolesSelected.itemFileOfUser.fo_id : this.props.folderRolesSelected.itemFolder != undefined && this.props.folderRolesSelected.itemFolder.fo_id_parent;
		if (fo_id_parent != false) {
			this.folderParent = await stores.resourseStore.getFolderById(fo_id_parent);

		}
	}
	onSaveDesc = async () => {
		if (this.props.onSaveDesc != undefined) {
			this.props.onSaveDesc(this.state.desc);
		}
	}
	onCancel = async () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}

	render() {
		const { fileRolesSelected, folderRolesSelected } = this.props;
		const isFile: boolean = fileRolesSelected.fi_us_id != undefined;
		return (
			<Card>
				<div style={{ marginTop: '20px' }}>
					<h3>{isFile ? L("FileDetails") : L("FolderDetails")}</h3>
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("Type")} </span>
					<br />
					<span>{isFile ? L("File") : L("Folder")}</span>
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("Location")}</span>
					<br />
					{this.folderParent != undefined &&
						<span>{this.folderParent.fo_id == -1 ? L("DataShareWithMe") : this.folderParent.fo_name}</span>
					}
					{isFile &&
						<div>
							<span style={{ fontWeight: 500 }}>{L("Memory")}</span>
							<br />
							<span>{AppConsts.convertResourceFile(Math.round(fileRolesSelected.itemFileOfUser.fi_us_size / 1024 * 10))}</span>
						</div>
					}
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("LastUpdate")}</span>
					<br />
					<span>{isFile ? moment(fileRolesSelected.fi_ro_updated_at).format("hh:mm DD/MM/YYYY") : moment(folderRolesSelected.fo_ro_updated_at).format("hh:mm DD/MM/YYYY")}</span>
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("Creator")}</span>
					<br />
					<span>{isFile ? stores.sessionStore.getUserNameById(fileRolesSelected.us_id) : stores.sessionStore.getUserNameById(folderRolesSelected.us_id)}</span>
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("PermissionToDownload")}</span>
				</div>
				<div style={{ marginTop: '20px' }}>
					<span style={{ fontWeight: 500 }}>{L("Description")}</span>
					<Input value={this.state.desc} onBlur={this.onSaveDesc} onChange={(e) => this.setState({ desc: e.target.value })} />
				</div>
			</Card>
		)
	}
}