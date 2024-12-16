import * as React from 'react';
import { Card, Tabs, } from 'antd';
import TabMemberRegisterBorrow from './TabMemberRegisterBorrow';
import TabMemberManagerBorrowReturning from './TabMemberManagerBorrowReturning';
import TabMemberBorrowReturningLog from './TabMemberBorrowReturningLog';
import { L } from '@src/lib/abpUtility';


export const tabManager = {
	tab_1: L('RegisterToBorrow'),
	tab_2: L('DocumentBorrowingAndReturningManagement'),
	tab_3: L('DocumentBorrowingAndReturningLog'),

}
export default class ManagerBorrowReturning extends React.Component {
	state = {
	}


	render() {
		return (
			<Card>
				<Tabs defaultActiveKey={tabManager.tab_1} >
					<Tabs.TabPane tab={tabManager.tab_1} key={tabManager.tab_1}>
						<TabMemberRegisterBorrow />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2}>
						<TabMemberManagerBorrowReturning />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_3} key={tabManager.tab_3}>
						<TabMemberBorrowReturningLog />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		)
	}
}