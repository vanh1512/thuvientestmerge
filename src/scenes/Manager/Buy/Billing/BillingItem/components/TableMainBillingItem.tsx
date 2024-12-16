import * as React from 'react';
import { Button, Table, Form, Input, InputNumber, Row, Typography, Popconfirm, Col, } from 'antd';
import { BillingItemDto, CreateBillingItemInput, UpdateBillingItemInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { EditOutlined, PlusCircleOutlined, RestOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import rules from '@src/scenes/Validation';

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	required: boolean;
	dataIndex: string;
	title: any;
	inputType: 'number' | 'text' | 'note';
	record: BillingItemDto;
	index: number;
	children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	required,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber maxLength={AppConsts.maxLength.isbn} /> : <Input maxLength={AppConsts.maxLength.isbn} />;

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={inputType === "number" ? [rules.required, rules.numberOnly] : (inputType === "text" ? [rules.required, rules.chucai_so_kytudacbiet] : [])}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};