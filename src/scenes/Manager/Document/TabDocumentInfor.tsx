import * as React from 'react';
import { Button, Tabs, } from 'antd';
import CreateOrUpdateDoccument from './components/CreateOrUpdateDocument';
import DocumentInfor from '../DocumentInfor';
import { DocumentDto } from '@src/services/services_autogen';
import { StepBackwardOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import Citation from '../Citation';

export interface Iprops {
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	documentSelected: DocumentDto;
	checkTab: boolean;
	findCitation: (item: DocumentDto) => {}
}
export const tabManager = {
	tab_1: L("Document"),
	tab_2: L('DocumentInformation'),
	tab_3: L('trich_dan'),
}
export default class TabCreateUpdateDocumentDocumentInfor extends React.Component<Iprops> {
	render() {
		return (
			<>
				<Tabs defaultActiveKey={this.props.checkTab == true ? tabManager.tab_3 : tabManager.tab_1}>
					<Tabs.TabPane tab={(
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Button
								icon={<StepBackwardOutlined style={{ margin: '0' }} />}
								onClick={this.props.onCancel}
								style={{ marginRight: '5px' }}
							/>
							{tabManager.tab_1}
						</div>
					)} key={tabManager.tab_1}>
						<CreateOrUpdateDoccument
							onCreateUpdateSuccess={this.props.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							documentSelected={this.props.documentSelected}
						/>
					</Tabs.TabPane>
					{this.props.documentSelected.do_id !== undefined &&
						<Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2}>
							<DocumentInfor do_id={this.props.documentSelected.do_id}></DocumentInfor>
						</Tabs.TabPane>

					}
					{this.props.documentSelected.do_id !== undefined &&
						<Tabs.TabPane tab={tabManager.tab_3} key={tabManager.tab_3}>
						<Citation documentSelected={this.props.documentSelected} findCitation={(this.props.findCitation)} />
					</Tabs.TabPane>
					}

				</Tabs>
			</>
		)
	}
}