import * as React from 'react';
import { List } from 'antd';
import './index.less';
import { L } from '@src/lib/abpUtility';

export interface ListItem {
	title: string;
	body: string | React.ReactNode;
}

export interface IListExampleProps {
	value: ListItem[];
	header?: string;
	footer?: string;
}

const ListExample: React.SFC<IListExampleProps> = (props: IListExampleProps) => {
	return (
		<List
			header={props.header}
			footer={props.footer}
			split={false}
			size="small"
			dataSource={props.value}
			renderItem={(item: any) => (
				<List.Item  style={{padding: 0}}>
					<List.Item.Meta title={L(item.title)}/>
					<span style={{color: '#fff'}}>{L(item.body)}</span>
				</List.Item>
			)}
		/>
	);
};

export default ListExample;
