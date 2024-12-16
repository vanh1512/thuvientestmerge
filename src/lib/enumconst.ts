import { CheckCircleOutlined, CheckOutlined, ExclamationOutlined, FieldTimeOutlined, InfoOutlined, IssuesCloseOutlined, MinusCircleOutlined, SafetyCertificateOutlined, SendOutlined, SmallDashOutlined, SyncOutlined, UserOutlined, WifiOutlined, WarningOutlined, CloseOutlined, BookOutlined, CloseCircleOutlined, CloseSquareFilled, CloseSquareOutlined } from '@ant-design/icons';
import { L } from './abpUtility';

export class MEnum {
	num: number;
	name: string;
	color: string;
	icon: any;
	constructor(num: number | 0, name: string | "", color?: string, icon?: any) {
		this.num = num;
		this.name = name;
		this.color = color || "green";
		this.icon = icon || "";
	}
}
const _getValue = (enu: MEnum[], val: number | undefined, col: "name" | "color" | "icon"): string => {
	if (val !== undefined) {
		let item = enu.find(item => item.num == val);
		if (item !== undefined) {
			return L(item[col]);
		}
	}
	return "";
}
//---------------------------------------------------------------------------------------------------------

export const eBorrowReturningStatus = {
	CHO_DUYET: new MEnum(10, L("NoneBorrowReturningStatus"), '#5D8AA8', MinusCircleOutlined),
	DANG_MUON: new MEnum(20, L("Borrowing"), 'geekblue', BookOutlined),
	QUA_HAN: new MEnum(30, L("OutOfDate"), 'volcano', IssuesCloseOutlined),
	CAN_THU_HOI: new MEnum(40, L("RequestToTakeBack"), '#F79327', WarningOutlined),
	YEU_CAU_GIA_HAN: new MEnum(50, L("ExtendRequest"), '#19A7CE', FieldTimeOutlined),
	DA_TRA: new MEnum(60, L("Returned"), 'green', CheckOutlined),
	MAT: new MEnum(120, L("Lost"), '#FE0000', CloseOutlined),
}
export const valueOfeBorrowReturningStatus = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturningStatus), val, "name");
}
export const colorEBorrowReturningStatus = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturningStatus), val, "color");
}

export const iconEBorrowReturningStatus = (val: number | undefined): any => {
	return (_getValue(Object.values(eBorrowReturningStatus), val, "icon"));
}
//---------------------------------------------------------------------------------------------------------



export const eBorrowReturningProcess = {
	// NONE: new MEnum(0, L("NoneBorrowReturningProcess"), '#5D8AA8', MinusCircleOutlined),
	CHO_DUYET: new MEnum(10, L("WaitingApprove"), 'gold', SyncOutlined),
	DA_DUYET: new MEnum(20, L("Approved"), '#0D98BA', CheckCircleOutlined),
	DA_GIAO_TAI_LIEU: new MEnum(30, L("Deliveried"), '#29AB87', SendOutlined),
	USER_HUY_YEU_CAU: new MEnum(40, L("UserCancel"), '#993300', CloseCircleOutlined),
	MEMBER_HUY_YEU_CAU: new MEnum(50, L("MemberCancel"), '#FF0800', CloseSquareOutlined),
	YEU_CAU_QUA_HAN: new MEnum(60, L("TimeOutRegister"), '#FF0800', ExclamationOutlined),
	DA_TRA_1PHAN: new MEnum(70, L("ReturnFew"), 'green', IssuesCloseOutlined),
	DA_TRA_HET: new MEnum(80, L("ReturnAll"), 'magenta', SafetyCertificateOutlined),

}
export const valueOfeBorrowReturningProcess = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturningProcess), val, "name");
}

export const colorEBorrowReturningProcess = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturningProcess), val, "color");
}

export const iconEBorrowReturningProcess = (val: number | undefined) => {
	return (_getValue(Object.values(eBorrowReturningProcess), val, "icon"));
}


//---------------------------------------------------------------------------------------------------------


export const eBorrowReturningDetailStatus = {
	NONE: new MEnum(10, L("NONE")),
	DANG_MUON: new MEnum(20, L("Borrowing")),
	QUA_HAN: new MEnum(30, L("OutOfDate")),
	CAN_THU_HOI: new MEnum(40, L("RequestToTakeBack")),
	YEU_CAU_GIA_HAN: new MEnum(50, L("ExtendRequest")),
	DA_TRA: new MEnum(60, L("Returned")),
	MAT: new MEnum(120, L("Lost")),
	DANG_QUET: new MEnum(130, L("Scanning")),
	DANG_BAO_MAT: new MEnum(140, L("Losing")),


}
export const valueOfeBorrowReturningDetailStatus = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturningDetailStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------


export const eBorrowMethod = {
	OFFLINE: new MEnum(0, L("Offline"), 'error', ExclamationOutlined),
	ONLINE: new MEnum(1, L("Online"), 'success', WifiOutlined),
}
export const valueOfeBorrowMethod = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowMethod), val, "name");
}
export const colorEBorrowMethod = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowMethod), val, "color");
}

export const iconEBorrowMethod = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowMethod), val, "icon");
}

//---------------------------------------------------------------------------------------------------------

export const eBillStatus = {
	Draft: new MEnum(0, L("Draft")),
	Success: new MEnum(1, L("Success")),
	Cancel: new MEnum(2, L("Cancel")),

}
export const valueOfeBillStatus = (val: number | undefined) => {
	return _getValue(Object.values(eBillStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

//Chua dich!!!!
export const eBorrowReturnLogType = {
	NONE: new MEnum(0, L("NONE")),
	UPDATE: new MEnum(1, L("UPDATE")),
	REGISTER_BORROW: new MEnum(2, L("REGISTER_BORROW")),
	REGISTER_BORROW_MEMBER: new MEnum(3, L("REGISTER_BORROW_MEMBER")),
	APROVE: new MEnum(4, L("APROVE")),
	BORROW: new MEnum(5, L("BORROW")),
	DELETE: new MEnum(6, L("DELETE")),
	DELETE_DETAIL_ITEM: new MEnum(7, L("DELETE_DETAIL_ITEM")),
	CANCEL: new MEnum(8, L("CANCEL")),
	CANCEL_MEMBER: new MEnum(9, L("CANCEL_MEMBER")),
	RETURN: new MEnum(10, L("RETURN")),
	EXTEND: new MEnum(11, L("EXTEND")),
	PUNISH: new MEnum(12, L("PUNISH")),
}
export const valueOfeBorrowReturnLogType = (val: number | undefined) => {
	return _getValue(Object.values(eBorrowReturnLogType), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eUserType = {
	Member: new MEnum(0, L("Member")),
	Manager: new MEnum(1, L("Manager")),
	Other: new MEnum(2, L("Others")),
}
export const valueOfeUserType = (val: number | undefined) => {
	return _getValue(Object.values(eUserType), val, "name");
}//---------------------------------------------------------------------------------------------------------
export const eCheckProcess = {
	Creating: new MEnum(1, L("Creating")),
	Wait_Approve: new MEnum(2, L("WaitingApprove")),
	Approved: new MEnum(3, L("WaitingSign")),
	Sign: new MEnum(4, L("Signed")),
	Cancel: new MEnum(5, L("CancelProcess")),
	Give_Back: new MEnum(6, L("Give_Back")),
	CHECKING: new MEnum(7, L("Checking")),
	DONE: new MEnum(8, L("DoneChecking")),
}
export const valueOfeCheckProcess = (val: number | undefined) => {
	return _getValue(Object.values(eCheckProcess), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eCheckItemStatus = {
	DOING: new MEnum(0, L("Doing")),
	DONE: new MEnum(1, L("Done")),

}
export const valueOfeCheckItemStatus = (val: number | undefined) => {
	return _getValue(Object.values(eCheckItemStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eDocumentItemStatus = {
	WaitingCataloging: new MEnum(0, L("WaitingCataloging")),
	Valid: new MEnum(1, L("AllowedUsing")),
	Borrow: new MEnum(2, L("Borrowed")),
	Lost: new MEnum(3, L("Lost")),
	Broken: new MEnum(4, L("Corrputed")),
}
export const valueOfeDocumentItemStatus = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentItemStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------
export const eDocumentPeriod = {
	bathang: new MEnum(90, "3 " + " " + L("months")),
	sauthang: new MEnum(180, "6 " + " " + L("months")),
	chinthang: new MEnum(270, "9 " + " " + L("months")),
	motnam: new MEnum(365, "1 " + " " + L("year")),
	hainam: new MEnum(730, "2 " + " " + L("years")),
}
export const valueOfeDocumentPeriod = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentPeriod), val, "name");
}
export const eDocumentStatus = {
	Plan: new MEnum(0, L("Importing")),
	In: new MEnum(1, L("Imported")),
}
export const valueOfeDocumentStatus = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentStatus), val, "name");
}
export const eDocumentBorrowType = {
	OfflineAndOnline: new MEnum(0, L("AllowedToBorrow")),
	Online: new MEnum(1, L("OnlyOnline")),
	Deny: new MEnum(2, L("Denied")),
}
export const valueOfeDocumentBorrowType = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentBorrowType), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eDocumentLogAction = {
	NONE: new MEnum(0, L("NONE")),
	CREATE: new MEnum(1, L("CREATE")),
	UPDATE: new MEnum(2, L("UPDATE")),
}
export const valueOfeDocumentLogAction = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentLogAction), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eDocumentSort = {
	ASC: new MEnum(1, L("Ascending")),
	DES: new MEnum(2, L("Descending")),
}
export const valueOfeDocumentSort = (val: number | undefined) => {
	return _getValue(Object.values(eDocumentSort), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eFolderAction = {
	Add: new MEnum(0, L("Add")),
	Edit: new MEnum(1, L("Edit")),
	Delete: new MEnum(2, L("Delete")),
	Marker: new MEnum(3, L("Mark")),

}
export const valueOfeFolderAction = (val: number | undefined) => {
	return _getValue(Object.values(eFolderAction), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eResourceRoleStatus = {
	VIEW: new MEnum(0, L("Viewer")),
	EDITOR: new MEnum(1, L("Editor")),
}
export const valueOfeResourceRoleStatus = (val: number | undefined) => {
	return _getValue(Object.values(eResourceRoleStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eResourceRoleType = {
	PRIVATE: new MEnum(0, L("Private")),
	PUBLIC_ALL: new MEnum(1, L("Public")),
}
export const valueOfeResourceRoleType = (val: number | undefined) => {
	return _getValue(Object.values(eResourceRoleType), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eMemberRegisterStatus = {
	NONE: new MEnum(5, L("None")),
	ACCEPTED: new MEnum(10, L("Accepted")),
	REJECT: new MEnum(15, L("Reject")),
}
export const valueOfeMemberRegisterStatus = (val: number | undefined) => {
	return _getValue(Object.values(eMemberRegisterStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eMCardStatus = {
	Register: new MEnum(0, L("RegisterCard")),
	Creating: new MEnum(1, L("CreatingCardState")),
	Timeup: new MEnum(2, L("OutOfDate")),
	DebtDocument: new MEnum(3, L("DocumentDept")),
	DebtMoney: new MEnum(4, L("MoneyDept")),
}
export const valueOfeMCardStatus = (val: number | undefined) => {
	return _getValue(Object.values(eMCardStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eReceiptStatus = {
	Chua_nhap_tai_lieu: new MEnum(1, L("Chưa nhập tài liệu")),
	Da_nhap_tai_lieu: new MEnum(2, L("Đã nhập tài liệu")),
}
export const valueOfeReceiptStatus = (val: number | undefined) => {
	return _getValue(Object.values(eReceiptStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eMCardType = {
	Adult: new MEnum(1, L("Adult")),
	Children: new MEnum(2, L("Kid")),
}
export const valueOfeMCardType = (val: number | undefined) => {
	return _getValue(Object.values(eMCardType), val, "name");
}

export const eMCardState = {
	Open: new MEnum(0, L("OpenningCard")),
	Block: new MEnum(1, L("LockedCard")),
}
export const valueOfeMCardState = (val: number | undefined) => {
	return _getValue(Object.values(eMCardState), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eMemberAction = {
	Create: new MEnum(1, L("Creating")),
	ChangeStatus: new MEnum(2, L("ChangeStatus")),
	ChangeMoney: new MEnum(3, L("ChangeMoney")),
	Lock: new MEnum(4, L("Locked")),
	UnLock: new MEnum(5, L("Unlocked")),
}
export const valueOfeMemberAction = (val: number | undefined) => {
	return _getValue(Object.values(eMemberAction), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eProcess = {
	Creating: new MEnum(1, L("Creating")),
	Wait_Approve: new MEnum(2, L("WaitingApprove")),
	Approved: new MEnum(3, L("WaitingSign")),
	Sign: new MEnum(4, L("Signed")),
	Cancel: new MEnum(5, L("CancelProcess")),
	Give_Back: new MEnum(6, L("Give_Back")),
	Complete: new MEnum(10, L("Completed")),
}
export const valueOfeProcess = (val: number | undefined) => {
	return _getValue(Object.values(eProcess), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const ePlanDetailType = {
	Sach: new MEnum(1, L("Books")),
	Bao: new MEnum(2, L("Newspaper")),
	Tap_chi: new MEnum(3, L("Magazines")),
	Tai_lieu_dien_tu: new MEnum(4, L("E_Documents")),
	Luan_van: new MEnum(5, L("Dissertation")),
	Do_an: new MEnum(6, L("Project")),
	Giao_trinh: new MEnum(7, L("Curriculum")),
	De_cuong: new MEnum(8, L("Proposal")),
	Dia_CD: new MEnum(9, L("CD_Disk")),
	Dia_DVD: new MEnum(10, L("DVD_Disk")),
}
export const valueOfePlanDetailType = (val: number | undefined) => {
	return _getValue(Object.values(ePlanDetailType), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const ePlanDetailStatusBook = {
	New: new MEnum(1, L("New")),
	Old: new MEnum(2, L("Old")),
	Damaged: new MEnum(3, L("Corruption")),
}
export const valueOfePlanDetailStatusBook = (val: number | undefined) => {
	return _getValue(Object.values(ePlanDetailStatusBook), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const ePlanDetailStatus = {
	chua_nhap_kho: new MEnum(1, L("NotImported")),
	da_nhap_kho: new MEnum(2, L("Imported")),
}
export const valueOfPlanDetailStatus = (val: number | undefined) => {
	return _getValue(Object.values(ePlanDetailStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eStatusPublishRegister = {
	NONE: new MEnum(0, L("None")),
	ACCEPTED: new MEnum(1, L("Accepted")),
	REJECT: new MEnum(2, L("Reject")),
}
export const valueOfeStatusPublishRegister = (val: number | undefined) => {
	return _getValue(Object.values(eStatusPublishRegister), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eTypePublishRegister = {
	HARD: new MEnum(0, L("Hard")),
	SOFT: new MEnum(1, L("Soft")),
}
export const valueOfeTypePublishRegister = (val: number | undefined) => {
	return _getValue(Object.values(eTypePublishRegister), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const ePublishSettingType = {
	OnlyOnce: new MEnum(0, L("OnlyOnce")),
	Dayly: new MEnum(1, L("Daily")),
	Monthly: new MEnum(2, L("Monthly")),
	Yearly: new MEnum(3, L("Yearly")),

}
export const valueOfePublishSettingType = (val: number | undefined) => {
	return _getValue(Object.values(ePublishSettingType), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eFileState = {
	DRAFT: new MEnum(0, "DRAFT"),
	COMPLETE: new MEnum(1, "COMPLETE"),
}
export const valueOfeFileState = (val: number | undefined) => {
	return _getValue(Object.values(eFileState), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eTypeFile = {
	IMAGE: new MEnum(0, "IMAGE"),
	PDF: new MEnum(1, "PDF"),
	NONE: new MEnum(2, "NONE"),
}
export const valueOfeTypeFile = (val: number | undefined) => {
	return _getValue(Object.values(eTypeFile), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eStatisticStorageStatus = {
	None: new MEnum(0, L("CreatingUser")),
	Cho_phe_duyet: new MEnum(5, L("WaitingApprove")),
	Phe_Duyet: new MEnum(10, L("Approved")),
	Tu_choi_phe_duyet: new MEnum(15, L("Reject")),

}
export const valueOfeStatisticStorageStatus = (val: number | undefined) => {
	return _getValue(Object.values(eStatisticStorageStatus), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eGENDER = {
	FEMALE: new MEnum(0, L("Female")),
	MALE: new MEnum(1, L("Male")),
	OTHER: new MEnum(2, L("Others")),
}
export const valueOfeGENDER = (val: number | undefined) => {
	return _getValue(Object.values(eGENDER), val, "name");
}
//---------------------------------------------------------------------------------------------------------


export const eRepositoryType = {
	KHO: new MEnum(1, L("Depot")),
	HOP: new MEnum(2, L("Box")),
	KE: new MEnum(3, L("Shelf")),
	TU: new MEnum(4, L("Cabinet")),
}

export const valueOfeRepositorType = (val: number | undefined) => {
	return _getValue(Object.values(eRepositoryType), val, "name");
}

//----------------------------------------------------------------------------------------------------------
export const enumContracStatus = {
	INIT: new MEnum(0, L("Creating")),
	DOING: new MEnum(1, L("Doing")),
	DONE: new MEnum(2, L("Done")),
}
export const valueOfeContract = (val: number | undefined) => {
	return _getValue(Object.values(enumContracStatus), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const ePunishError = {
	MAT_TAI_LIEU: new MEnum(1, L("Lost_document")),
	QUA_HAN: new MEnum(2, L("Out_of_date")),
	HU_HONG: new MEnum(3, L("Document_damaged")),
}
export const valueOfePunishError = (val: number | undefined) => {
	return _getValue(Object.values(ePunishError), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const eTypeFileFolder = {
	FOLDER: new MEnum(0, L("Folder")),
	IMAGE: new MEnum(1, L("Image")),
	VIDEO: new MEnum(2, L("Video")),
	WORD: new MEnum(3, L("Word")),
	EXCEL: new MEnum(4, L("Excel")),
	PDF: new MEnum(5, L("Pdf")),
	NONE: new MEnum(6, L("None")),
}
export const valueOfeTypeFileFolder = (val: number | undefined) => {
	return _getValue(Object.values(eTypeFileFolder), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const eDefaultRole = {
	MEMBER: new MEnum(0, L("Member")),
	MANAGER: new MEnum(1, L("Manager")),
	BOTH: new MEnum(2, L("Both")),
}
export const valueOfeDefaultRole = (val: number | undefined) => {
	return _getValue(Object.values(eDefaultRole), val, "name");
}
//----------------------------------------------------------------------------------------------------------

export const eCitationType = {
	Sach: new MEnum(10, L("Book")),
	Bai_bao_tap_chi: new MEnum(20, L("Bai_bao_tap_chi")),
	Trang_web: new MEnum(30, L("Trang_web")),
}
export const valueOfeCitationType = (val: number | undefined) => {
	return _getValue(Object.values(eCitationType), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const eCitationStructure = {
	MLA: new MEnum(1, L("MLA")),
	APA: new MEnum(2, L("APA")),
	Bo_GD_DT_VN: new MEnum(3, L("Bo_GD_DT_VN")),
}
export const valueOfeCitationStructure = (val: number | undefined) => {
	return _getValue(Object.values(eCitationStructure), val, "name");
}