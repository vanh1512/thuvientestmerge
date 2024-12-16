import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Tabs, } from 'antd';
import { L } from '@lib/abpUtility';
import TabApproveBorrowReturning from './TabApproveBorrowReturning';
import TabExtendBorrowReturning from './TabExtendBorrowReturning';
import TabReturnDocumentBorrowReturning from './TabReturnDocumentBorrowReturning';
import LibrarianBorrow from './LibrarianBorrow/LibrarianBorrow';
import TabBorrowReturningLog from './TabBorrowReturningLog/TabBorrowReturningLog';
import ManagerAllBorrowReturning from './TabManagerAllBorrowReturning';
import { eBorrowReturningProcess } from '@src/lib/enumconst';
import TabDeliveryDocumentBorrowReturning from './TabDeliveryDocumentBorrowReturning';


export const tabManager = {
	tab_1: L('Librian') + " " + L('RegisterToBorrow'),
	tab_2: L('ListOfRegisteredDocumentBorrowings'),
	tab_3: L('DeliverDocuments'),
	tab_4: L('ExtendDocuments'),
	tab_5: L('ReturnDocuments'),
	tab_6: L('ManagerBorrowReturningDocument'),
	tab_7: L('DocumentBorrowingAndReturningLog'),
}
export default class ManagerBorrowReturning extends React.Component {
	state = {
		isLoadDone: false,
	}
	render() {
		return (
			<Card>
				<Tabs destroyInactiveTabPane defaultActiveKey={tabManager.tab_1}>
					<Tabs.TabPane tab={tabManager.tab_1} key={tabManager.tab_1}>
						<LibrarianBorrow />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2}>
						<TabApproveBorrowReturning titleHeader={tabManager.tab_2} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_3} key={tabManager.tab_3}>
						<TabDeliveryDocumentBorrowReturning titleHeader={tabManager.tab_3} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_4} key={tabManager.tab_4}>
						<TabExtendBorrowReturning titleHeader={tabManager.tab_4} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_5} key={tabManager.tab_5}>
						<TabReturnDocumentBorrowReturning titleHeader={tabManager.tab_5} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_6} key={tabManager.tab_6}>
						<ManagerAllBorrowReturning />
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_7} key={tabManager.tab_7}>
						<TabBorrowReturningLog />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		)
	}
}