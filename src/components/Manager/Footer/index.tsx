import * as React from 'react';
import { Layout } from 'antd';
import './index.less';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';

const Footer = () => {
	const currentDate = moment();
	return (
		<Layout.Footer className={'footer'} style={{ textAlign: 'center' }}>
			MLibrary - MIGViet © {currentDate.format("YYYY")} <a href="https://migviet.com/">{L("HomePage")}</a>
		</Layout.Footer>
	);
};
export default Footer;
