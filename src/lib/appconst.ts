import { AttachmentItem, FilesOfUserRolesDto } from "@src/services/services_autogen";

export enum FileUploadType {
    Avatar = 0,
    Symbols = 1,
    Contracts = 2,
    MemberCard = 3,
    Billing = 4,
    Author = 5,
    Supplier = 6,
    Pubisher = 7,
    AvatarUser = 8,

};
export enum EventTable {
    ChangeStatus,
    Delete,
    Edit,
    RowDoubleClick,
    View,
    PrintLabel,
}
//định nghĩa tính năng của table
export const cssCol = (col: number) => {
    return {
        xs: { span: col },
        sm: { span: col },
        md: { span: col },
        lg: { span: col },
        xl: { span: col },
        xxl: { span: col },
    };
}
export const cssColResponsiveSpan = (xs: number, sm: number, md: number, lg: number, xl: number, xxl: number,) => {
    return {
        xs: { span: xs },
        sm: { span: sm },
        md: { span: md },
        lg: { span: lg },
        xl: { span: xl },
        xxl: { span: xxl },
    };
}
export enum RouterPath {
    g_ = "/g",
    g_login = "/g/login",
    g_forgot = "/g/forgot",
    g_exception = "/g/exception",

    g_opacpage = "/g/opacpage",
    g_opacpage_rules = "/g/opacpageRules",
    g_opacpage_search = "/g/opacpageSearch",
    g_opacpage_detail_document = "/g/opacpage-detail-document",
    g_opacpage_timeOpen = "/g/opacpageTimeOpen",
    g_opacpage_extend = "/g/opacpage-extend",
    g_opacpage_instruction_extend = "/g/opacpage-instruction-extend",
    g_opacpage_mostviewdocument = "/g/opacpage-mostviewdocument",
    g_opacpage_mostborrowdocument = "/g/opacpage-mostborrowdocument",
    g_opacpage_documentnewest = "/g/opacpage-documentnewest",
    g_opacpage_borrowreturning = "/g/opacpage-borrowreturning",
    admin = "/",
    admin_home = "/",
    admin_drashboard = "/drashboard",
    admin_borrow = "/borrow",
    admin_buy = "/buy",
    admin_buy_importing_receipt = "/buy/importing-receipt",
    admin_check = "/check",
    admin_document = "/document",
    admin_general = "/general",
    admin_general_author = "/general/author",
    admin_general_field = "/general/fields",
    admin_report = "/report",
    admin_resource = "/resources",
    admin_subscriber = "/subscriber",
    admin_system = "/system",
    admin_information = "/information",
    admin_logout = "/logout",
    admin_general_supplier = "/general/supplier",
    admin_general_languages = "/general/languages",
    admin_general_marc21 = "/general/marc21",
    admin_general_sup_field_marc21 = "/general/sup_field_marc21",
    admin_general_punish = "/general/punish",
};
export const AppConsts = {
    userManagement: {
        defaultAdminUserName: 'admin',
    },
    localization: {
        defaultLocalizationSourceName: 'MIGViet',
    },

    appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
    remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    webInformation: "http://mlibrary.vn/",
    agency: "TUYÊN QUANG",
    library: "THƯ VIỆN TỈNH TUYÊN QUANG",
    Permission: {

        Manager_File_Remove: "Manager.File.Remove",
        Manager_File_Upload: "Manager.File.Upload",

        /* ------------------------------------------------------ System ------------------------------------------------------*/
        System_SystemApplications: "System.SystemApplications",
        System_SystemApplications_Create: "System.SystemApplications.Create",
        System_SystemApplications_Edit: "System.SystemApplications.Edit",
        System_SystemApplications_Delete: "System.SystemApplications.Delete",
        System_SystemApplications_Export: "System.SystemApplications.Export",

        System_Users: "System.Users",
        System_Users_Create: "System.Users.Create",
        System_Users_Edit: "System.Users.Edit",
        System_Users_Delete: "System.Users.Delete",
        System_Users_ChangePassWord: "System.Users.ChangePassWord",

        System_Organization: "System.Organization",
        System_Organization_Create: "System.Organization.Create",
        System_Organization_Edit: "System.Organization.Edit",
        System_Organization_Move: "System.Organization.Move",
        System_Organization_Delete: "System.Organization.Delete",
        System_Organization_CreateUser: "System.Organization.CreateUser",
        System_Organization_DeleteUser: "System.Organization.DeleteUser",
        System_Organization_CreateRole: "System.Organization.CreateRole",
        System_Organization_DeleteRole: "System.Organization.DeleteRole",

        System_Roles: "System.Roles",
        System_Roles_Create: "System.Roles.Create",
        System_Roles_Edit: "System.Roles.Edit",
        System_Roles_Delete: "System.Roles.Delete",

        System_Tenants: "System.Tenants",
        System_Tenants_Create: "System.Tenants.Create",
        System_Tenants_Edit: "System.Tenants.Edit",
        System_Tenants_Delete: "System.Tenants.Delete",

        System_AuditLog: "System.AuditLog",
        System_AuditLog_Create: "System.AuditLog.Create",
        System_AuditLog_Edit: "System.AuditLog.Edit",
        System_AuditLog_Delete: "System.AuditLog.Delete",
        System_AuditLog_DeleteAll: "System.AuditLog.DeleteAll",

        System_Setting: "System.Setting",

        System_WebHookSubcription: "System.WebHookSubcription",
        System_WebHookSubcription_Create: "System.WebHookSubcription.Create",
        System_WebHookSubcription_Edit: "System.WebHookSubcription.Edit",
        System_WebHookSubcription_Delete: "System.WebHookSubcription.Delete",
        System_WebHookSubcription_Detail: "System.WebHookSubcription.Detail",

        /* ------------------------------------------------------ Borrow ------------------------------------------------------*/
        Borrow_MemberBorror: "Borrow.MemberBorror",

        Borrow_BorrowReturing: "Borrow.BorrowReturing",
        Borrow_BorrowReturing_Register: "Borrow.BorrowReturing.Register",
        Borrow_BorrowReturing_Deliver: "Borrow.BorrowReturing.Deliver",
        Borrow_BorrowReturing_Extend: "Borrow.BorrowReturing.Extend",
        Borrow_BorrowReturing_Return: "Borrow.BorrowReturing.Return",
        Borrow_BorrowReturing_Approve: "Borrow.BorrowReturing.Approve",
        Borrow_BorrowReturing_Export: "Borrow.BorrowReturing.Export",
        Borrow_BorrowReturing_Detail: "Borrow.BorrowReturing.Detail",

        Borrow_BorrowReturingLog: "Borrow.BorrowReturingLog",

        /* ------------------------------------------------------ Buy ------------------------------------------------------*/
        Buy_Plan: "Buy.Plan",
        Buy_Plan_Create: "Buy.Plan.Create",
        Buy_Plan_Edit: "Buy.Plan.Edit",
        Buy_Plan_Delete: "Buy.Plan.Delete",
        Buy_Plan_Detail: "Buy.Plan.Detail",
        Buy_Plan_Export: "Buy.Plan.Export",
        Buy_Plan_Approve: "Buy.Plan.Approve",
        Buy_Plan_Sign: "Buy.Plan.Sign",

        Buy_Buying: "Buy.Buying",
        Buy_Buying_Create: "Buy.Buying.Create",
        Buy_Buying_Edit: "Buy.Buying.Edit",
        Buy_Buying_Delete: "Buy.Buying.Delete",
        Buy_Buying_Detail: "Buy.Buying.Detail",
        Buy_Buying_Export: "Buy.Buying.Export",
        Buy_Buying_Confirm: "Buy.Buying.Confirm",

        Buy_Receipt: "Buy.Receipt",
        Buy_Receipt_Create: "Buy.Receipt.Create",
        Buy_Receipt_Edit: "Buy.Receipt.Edit",
        Buy_Receipt_Delete: "Buy.Receipt.Delete",
        Buy_Receipt_PrintReceip: "Buy.Receipt.PrintReceip",
        Buy_Receipt_Export: "Buy.Receipt.Export",
        Buy_Receipt_Cataloging: "Buy.Receipt.Cataloging",

        /* ------------------------------------------------------ Check ------------------------------------------------------*/
        Check_Check: "Check.Check",
        Check_Check_Create: "Check.Check.Create",
        Check_Check_Edit: "Check.Check.Edit",
        Check_Check_Delete: "Check.Check.Delete",
        Check_Check_Detail: "Check.Check.Detail",
        Check_Check_CheckReport: "Check.Check.CheckReport",
        Check_Check_Export: "Check.Check.Export",
        Check_Check_CatalogingCheck: "Check.Check.CatalogingCheck",
        Check_Check_Approve: "Check.Check.Approve",
        Check_Check_Sign: "Check.Check.Sign",

        Check_WarningCheck: "Check.WarningCheck",
        Check_WarningCheck_Create: "Check.WarningCheck.Create",

        /* ------------------------------------------------------ Document -----------------------------------------------------*/
        Document_Document: "Document.Document",
        Document_Document_Create: "Document.Document.Create",
        Document_Document_Edit: "Document.Document.Edit",
        Document_Document_Delete: "Document.Document.Delete",
        Document_Document_Detail: "Document.Document.Detail",
        Document_Document_Export: "Document.Document.Export",

        Document_DocumentInfor: "Document.DocumentInfor",
        Document_DocumentInfor_Create: "Document.DocumentInfor.Create",
        Document_DocumentInfor_Edit: "Document.DocumentInfor.Edit",
        Document_DocumentInfor_Delete: "Document.DocumentInfor.Delete",
        Document_DocumentInfor_PrintLabel: "Document.DocumentInfor.PrintLabel",
        Document_DocumentInfor_Export: "Document.DocumentInfor.Export",

        /* ------------------------------------------------------ General -----------------------------------------------------*/
        General_Author: "General.Author",
        General_Author_Create: "General.Author.Create",
        General_Author_Edit: "General.Author.Edit",
        General_Author_Delete: "General.Author.Delete",
        General_Author_Export: "General.Author.Export",
        General_Author_Detail: "General.Author.Detail",
        General_Author_Import: "General.Author.Import",

        General_Category: "General.Category",
        General_Category_Create: "General.Category.Create",
        General_Category_Edit: "General.Category.Edit",
        General_Category_Delete: "General.Category.Delete",
        General_Category_Export: "General.Category.Export",
        General_Category_Sort: "General.Category.Sort",
        General_Category_Import: "General.Category.Import",

        General_Dictionary: "General.Dictionary",
        General_Dictionary_Create: "General.Dictionary.Create",
        General_Dictionary_Edit: "General.Dictionary.Edit",
        General_Dictionary_Delete: "General.Dictionary.Delete",
        General_Dictionary_Export: "General.Dictionary.Export",

        General_DictionaryType: "General.DictionaryType",
        General_DictionaryType_Create: "General.DictionaryType.Create",
        General_DictionaryType_Edit: "General.DictionaryType.Edit",
        General_DictionaryType_Delete: "General.DictionaryType.Delete",
        General_DictionaryType_Export: "General.DictionaryType.Export",
        General_DictionaryType_ChangeStatus: "General.DictionaryType.ChangeStatus",

        General_Repository: "General.Repository",
        General_Repository_Create: "General.Repository.Create",
        General_Repository_Edit: "General.Repository.Edit",
        General_Repository_Delete: "General.Repository.Delete",
        General_Repository_Export: "General.Repository.Export",
        General_Repository_Sort: "General.Repository.Sort",
        General_Repository_Import: "General.Repository.Import",

        General_Fields: "General.Fields",
        General_Fields_Create: "General.Fields.Create",
        General_Fields_Edit: "General.Fields.Edit",
        General_Fields_Delete: "General.Fields.Delete",
        General_Fields_Export: "General.Fields.Export",
        General_Fields_Import: "General.Fields.Import",
        General_Fields_Sort: "General.Fields.Sort",

        General_Supplier: "General.Supplier",
        General_Supplier_Create: "General.Supplier.Create",
        General_Supplier_Edit: "General.Supplier.Edit",
        General_Supplier_Delete: "General.Supplier.Delete",
        General_Supplier_Export: "General.Supplier.Export",
        General_Supplier_Import: "General.Supplier.Import",

        General_Topic: "General.Topic",
        General_Topic_Create: "General.Topic.Create",
        General_Topic_Edit: "General.Topic.Edit",
        General_Topic_Delete: "General.Topic.Delete",
        General_Topic_Export: "General.Topic.Export",
        General_Topic_Import: "General.Topic.Import",

        General_Publisher: "General.Publisher",
        General_Publisher_Create: "General.Publisher.Create",
        General_Publisher_Edit: "General.Publisher.Edit",
        General_Publisher_Delete: "General.Publisher.Delete",
        General_Publisher_Export: "General.Publisher.Export",
        General_Publisher_Import: "General.Publisher.Import",

        General_DocumentLanguages: "General.DocumentLanguages",
        General_DocumentLanguages_Create: "General.DocumentLanguages.Create",
        General_DocumentLanguages_Edit: "General.DocumentLanguages.Edit",
        General_DocumentLanguages_Delete: "General.DocumentLanguages.Delete",
        General_DocumentLanguages_Export: "General.DocumentLanguages.Export",
        General_DocumentLanguages_Import: "General.DocumentLanguages.Import",

        /* ------------------------------------------------------ Guest -----------------------------------------------------*/
        Guest_Login: "Guest.Login",
        Guest_Exception: "Guest.Exception",
        Guest_Forgot: "Guest.Forgot",
        Guest_Guest: "Guest.Guest",

        /* ------------------------------------------------------ Report -----------------------------------------------------*/
        Report_Status_DocumentWithCategory: "Report.Status.DocumentWithCategory",
        Report_Status_MemberWithMonth: "Report.Status.MemberWithMonth",
        Report_BorrowReturning_DocumentWithMonth: "Report.BorrowReturning.DocumentWithMonth",
        Report_BorrowReturning_DocumentWithCategory: "Report.BorrowReturning.DocumentWithCategory",
        Report_Borrow_MostMember: "Report.Borrow.MostMember",
        Report_Borrow_MostDocument: "Report.Borrow.MostDocument",
        Report_Borrow_MostLibrarian: "Report.Borrow.MostLibrarian",
        Report_Plan_PlanWithMonth: "Report.Plan.PlanWithMonth",
        Report_Plan_MostMoney: "Report.Plan.MostMoney",
        Report_Plan_Supplier: "Report.Plan.Supplier",

        /* ------------------------------------------------------ Resources -----------------------------------------------------*/
        Resources_FileDocument: "Resources.FileDocument",
        Resources_FilesOfUser: "Resources.FilesOfUser",
        Resources_FilesSharedWithUser: "Resources.FilesSharedWithUser",

        /* ------------------------------------------------------ Subscriber -----------------------------------------------------*/
        Subscriber_Member: "Subscriber.Member",
        Subscriber_Member_Create: "Subscriber.Member.Create",
        Subscriber_Member_Edit: "Subscriber.Member.Edit",
        Subscriber_Member_Delete: "Subscriber.Member.Delete",
        Subscriber_Member_Export: "Subscriber.Member.Export",
        Subscriber_Member_Detail: "Subscriber.Member.Detail",
        Subscriber_Member_Lock: "Subscriber.Member.Lock",
        Subscriber_Member_Approve: "Subscriber.Member.Approve",
        Subscriber_Member_ChangePassWord: "Subscriber.Member.Approve",

        Subscriber_MemberCard: "Subscriber.MemberCard",
        Subscriber_MemberCard_Create: "Subscriber.MemberCard.Create",
        Subscriber_MemberCard_Edit: "Subscriber.MemberCard.Edit",
        Subscriber_MemberCard_Delete: "Subscriber.MemberCard.Delete",
        Subscriber_MemberCard_Export: "Subscriber.MemberCard.Export",
        Subscriber_MemberCard_Extend: "Subscriber.MemberCard.Extend",
        Subscriber_MemberCard_Detail: "Subscriber.MemberCard.Detail",
        Subscriber_MemberCard_Lock: "Subscriber.MemberCard.Lock",
        Subscriber_MemberCard_PrintCard: "Subscriber.MemberCard.PrintCard",
        Subscriber_MemberCard_Approve: "Subscriber.MemberCard.Approve",
        Subscriber_MemberCard_Recharge: "Subscriber.MemberCard.Recharge",
        Subscriber_MemberCard_PrintRegister: "Subscriber.MemberCard.PrintRegister",

        Subscriber_MemberLog: "Subscriber.MemberLog",
        Subscriber_MemberLog_Export: "Subscriber.MemberLog.Export",

    },
    authorization: {
        releaseDate: 'releaseDate',
        encrptedAuthTokenName: 'enc_auth_token',
        initSheetData: 'get_All_Sheet_Data',
        factoryIdSelected: 'factory_Id_Selected',
        userId: 'id',
        fullName: 'name',
        avatar: 'avatar',

    },
    Granted_Permissions_Const: {
        Manager_File_Remove: { name: "Manager.File.Remove", display_name: "Manager.File.Remove" },
        Manager_File_Upload: { name: "Manager.File.Upload", display_name: "Manager.File.Upload" },

        /* ------------------------------------------------------ System ------------------------------------------------------*/
        System_SystemApplications: { name: "System.SystemApplications", display_name: "System.SystemApplications" },

        System_Users: { name: "System.Users", display_name: "System.Users" },

        System_Organization: { name: "System.Organization", display_name: "System.Organization" },

        System_Roles: { name: "System.Roles", display_name: "System.Roles" },

        System_Tenants: { name: "System.Tenants", display_name: "System.Tenants" },

        System_AuditLog: { name: "System.AuditLog", display_name: "System.AuditLog" },

        System_Setting: { name: "System.Setting", display_name: "System.Setting" },

        System_WebHookSubcription: { name: "System.WebHookSubcription", display_name: "System.WebHookSubcription" },

        /* ------------------------------------------------------ Borrow ------------------------------------------------------*/
        Borrow_MemberBorror: { name: "Borrow.MemberBorror", display_name: "Borrow.MemberBorror" },

        Borrow_BorrowReturing: { name: "Borrow.BorrowReturing", display_name: "Borrow.BorrowReturing" },

        Borrow_BorrowReturingLog: { name: "Borrow.BorrowReturingLog", display_name: "Borrow.BorrowReturingLog" },

        /* ------------------------------------------------------ Buy ------------------------------------------------------*/
        Buy_Plan: { name: "Buy.Plan", display_name: "Buy.Plan" },

        Buy_Buying: { name: "Buy.Buying", display_name: "Buy.Buying" },

        Buy_Receipt: { name: "Buy.Receipt", display_name: "Buy.Receipt" },

        /* ------------------------------------------------------ Check ------------------------------------------------------*/
        Check_Check: { name: "Check.Check", display_name: "Check.Check" },

        Check_WarningCheck: { name: "Check.WarningCheck", display_name: "Check.WarningCheck" },

        /* ------------------------------------------------------ Document -----------------------------------------------------*/
        Document_Document: { name: "Document.Document", display_name: "Document.Document" },

        Document_DocumentInfor: { name: "Document.DocumentInfor", display_name: "Document.DocumentInfor" },

        /* ------------------------------------------------------ General -----------------------------------------------------*/
        General_Author: { name: "General.Author", display_name: "General.Author" },

        General_Category: { name: "General.Category", display_name: "General.Category" },

        General_Dictionary: { name: "General.Dictionary", display_name: "General.Dictionary" },

        General_DictionaryType: { name: "General.DictionaryType", display_name: "General.DictionaryType" },

        General_Repository: { name: "General.Repository", display_name: "General.Repository" },

        General_Fields: { name: "General.Fields", display_name: "General.Fields" },

        General_Supplier: { name: "General.Supplier", display_name: "General.Supplier" },

        General_Topic: { name: "General.Topic", display_name: "General.Topic" },

        General_Publisher: { name: "General.Publisher", display_name: "General.Publisher" },

        General_DocumentLanguages: { name: "General.DocumentLanguages", display_name: "General.DocumentLanguages" },

        /* ------------------------------------------------------ Guest -----------------------------------------------------*/
        Guest_Login: { name: "Guest.Login", display_name: "Guest.Login" },
        Guest_Exception: { name: "Guest.Exception", display_name: "Guest.Exception" },
        Guest_Forgot: { name: "Guest.Forgot", display_name: "Guest.Forgot" },
        Guest_Guest: { name: "Guest.Guest", display_name: "Guest.Guest" },

        /* ------------------------------------------------------ Report -----------------------------------------------------*/
        Report_Status_DocumentWithCategory: { name: "Report.Status.DocumentWithCategory", display_name: "Report.Status.DocumentWithCategory" },
        Report_Status_MemberWithMonth: { name: "Report.Status.MemberWithMonth", display_name: "Report.Status.MemberWithMonth" },
        Report_BorrowReturning_DocumentWithMonth: { name: "Report.BorrowReturning.DocumentWithMonth", display_name: "Report.BorrowReturning.DocumentWithMonth" },
        Report_BorrowReturning_DocumentWithCategory: { name: "Report.BorrowReturning.DocumentWithCategory", display_name: "Report.BorrowReturning.DocumentWithCategory" },
        Report_Borrow_MostMember: { name: "Report.Borrow.MostMember", display_name: "Report.Borrow.MostMember" },
        Report_Borrow_MostDocument: { name: "Report.Borrow.MostDocument", display_name: "Report.Borrow.MostDocument" },
        Report_Borrow_MostLibrarian: { name: "Report.Borrow.MostLibrarian", display_name: "Report.Borrow.MostLibrarian" },
        Report_Plan_PlanWithMonth: { name: "Report.Plan.PlanWithMonth", display_name: "Report.Plan.PlanWithMonth" },
        Report_Plan_MostMoney: { name: "Report.Plan.MostMoney", display_name: "Report.Plan.MostMoney" },
        Report_Plan_Supplier: { name: "Report.Plan.Supplier", display_name: "Report.Plan.Supplier" },

        /* ------------------------------------------------------ Resources -----------------------------------------------------*/
        Resources_FileDocument: { name: "Resources.FileDocument", display_name: "Resources.FileDocument" },
        Resources_FilesOfUser: { name: "Resources.FilesOfUser", display_name: "Resources.FilesOfUser" },
        Resources_FilesSharedWithUser: { name: "Resources.FilesSharedWithUser", display_name: "Resources.FilesSharedWithUser" },

        /* ------------------------------------------------------ Subscriber -----------------------------------------------------*/
        Subscriber_Member: { name: "Subscriber.Member", display_name: "Subscriber.Member" },

        Subscriber_MemberCard: { name: "Subscriber.MemberCard", display_name: "Subscriber.MemberCard" },

        Subscriber_MemberLog: { name: "Subscriber.MemberLog", display_name: "Subscriber.MemberLog" },
    },
    bangChuyenDoi: {
        "a": "100", "ac": "101", "ach": "102", "ai": "103", "am": "104", "an": "105", "ang": "106", "anh": "107", "ao": "108", "ap": "109", "at": "110", "au": "111", "ay": "112", "ăc": "113", "ăm": "114", "ăn": "115", "ăng": "116", "ăp": "117", "ăt": "118", "ấc": "119", "âm": "120", "ân": "121", "âng": "122", "âp": "123", "ât": "124", "âu": "125", "ây": "126", "e": "200", "ec": "201", "em": "202", "en": "203", "eng": "204", "eo": "205", "ep": "206", "et": "207", "ê": "250", "êc": "251", "êch": "252", "êm": "253", "ên": "254", "êng": "255", "ênh": "256", "êp": "257", "êt": "258", "êu": "259", "i": "300", "ia": "301", "ich": "302", "iec": "303", "iêm": "304", "iên": "305", "iêng": "306", "iêp": "307", "iêt": "308", "iêu": "309", "im": "310", "in": "311", "inh": "312", "ip": "313", "it": "314", "iu": "315", "iz": "315", "o": "400", "oa": "401", "oac": "402", "oach": "403", "oai": "404", "oam": "405", "oan": "406", "oang": "407", "oanh": "408", "oao": "409", "oap": "410", "oat": "411", "oay": "412", "oăc": "413", "oăm": "414", "oăn": "415", "oăng": "416", "oăp": "417", "oăt": "418", "oc": "419", "oe": "420", "oec": "421", "oem": "422", "oen": "423", "oeng": "424", "oeo": "425", "oep": "426", "oet": "427", "oi": "428", "om": "429", "on": "430", "ong": "431", "ôc": "432", "op": "434", "ot": "435", "ô": "450", "ôi": "452", "ôm": "453", "ôn": "454", "ông": "455", "ôông": "456", "ôp": "457", "ôt": "458", "ơ": "460", "ơc": "461", "ơi": "462", "ơm": "463", "ơn": "464", "ơng": "465", "ơp": "466", "ơt": "467", "u": "500", "ua": "501", "uân": "502", "uâng": "503", "uât": "504", "uây": "505", "uc": "506", "uê": "507", "uêch": "508", "uênh": "509", "ui": "510", "um": "511", "un": "512", "ung": "513", "uôc": "514", "uôi": "515", "uôm": "516", "uôn": "517", "uông": "518", "uôt": "519", "uơ": "520", "up": "521", "ut": "523", "uy": "524", "uya": "525", "uyêch": "526", "uyên": "527", "uyêt": "528", "uym": "529", "uyn": "530", "uynh": "531", "uyp": "532", "uyt": "533", "ư": "550", "ưa": "551", "ưc": "552", "ưi": "553", "ưm": "554", "ưn": "555", "ưng": "556", "ươc": "557", "ươi": "558", "ươm": "559", "ươn": "560", "ương": "561", "ươp": "562", "ươt": "563", "ươu": "564", "ưt": "565", "ưu": "566", "y": "600", "ych": "601", "yêm": "602", "yên": "603", "yêng": "604", "yêt": "605", "yêu": "606", "ym": "607", "yn": "608", "ynh": "609",
        "yp": "610"
    },
    phuAm: ["gh", "ch", "gi", "kh", "nh", "qu", "th", "tr"],
    cssPanelMain: {
        left: cssCol(24),
        right: cssCol(10)
    },
    cssRightMain: {
        left: cssCol(14),
        right: cssCol(0),
    },
    // Tạo một từ điển với key là các chữ cái và value là mã màu hex
    backGroundColorByName: {
        'A': '#990000', // Đỏ tối
        'B': '#006600', // Xanh lá cây tối
        'C': '#000066', // Xanh dương tối
        'D': '#999900', // Vàng tối
        'Đ': '#999991', // Vàng tối
        'E': '#990099', // Hồng tối
        'F': '#006666', // Cyan tối
        'G': '#993300', // Cam đậm tối
        'H': '#662233', // Xanh da trời đậm tối
        'I': '#004040', // Xanh da trời nước biển tối
        'J': '#400040', // Tím tối
        'K': '#993322', // Đỏ cam tối
        'L': '#267326', // Xanh lá cây đậm tối
        'M': '#1a458b', // Xanh lam đậm tối
        'N': '#997200', // Vàng kim loại tối
        'O': '#400000', // Nâu đậm tối
        'P': '#7a297a', // Tím đậm tối
        'Q': '#004d00', // Xanh lá cây nhạt tối
        'R': '#993366', // Hồng nhạt tối
        'S': '#305b7b', // Xanh da trời nhạt tối
        'T': '#996300', // Cam tối
        'U': '#7a007a', // Màu đỏ tím tối
        'V': '#005c3f', // Xanh lá cây biển tối
        'W': '#354f1a', // Xanh lục nhạt tối
        'X': '#99004d', // Hồng đậm tối
        'Y': '#1a66cc', // Xanh dương đậm tối
        'Z': '#660000'  // Đỏ đậm tối
    },


    maxLength: {
        name: 500,
        address: 100,
        description: 500,
        password: 8,
        cccd: 12,
        email: 100,
        phone: 10,
        isbn: 20,
        code: 30,
        language: 50,
        mst: 20,
        mar21: 3,
    },
    formItemLayout: {
        labelCol: cssCol(8),
        wrapperCol: cssCol(16),
    },
    formItemLayoutResponsive(xs, sm, md, lg, xl, xxl) {
        return {
            labelCol: cssColResponsiveSpan(xs[0], sm[0], md[0], lg[0], xl[0], xxl[0]),
            wrapperCol: cssColResponsiveSpan(xs[1], sm[1], md[1], lg[1], xl[1], xxl[1]),
        };
    },
    filetest: new File(['Hello, world!'], 'test.txt', { type: 'text/plain' }),
    cssPanel(span: number) {
        return {
            xs: { span: span },
            sm: { span: span },
            md: { span: span },
            lg: { span: span },
            xl: { span: span },
            xxl: { span: span },
        }
    },
    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },

    formatNumber(price: number | undefined): string {
        if (price === undefined || isNaN(price)) {
            price = 0;
        }
        return new Intl.NumberFormat('en-US').format(price);
    },
    formatPassword(pass: string): boolean {
        // let expression = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
        // let expression = /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^!#%]*[!#%])[A-Za-z0-9!#%]{8,32}$/;
        let expression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/gm;
        return expression.test(pass);

    },
    testEmail(email: string) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
        if (pattern.test(email) == true) {
            return true;
        }
        return false;
    },
    testPhoneNumber(phoneNumber: string) {
        const pattern = /^(\(?\+\d{0,5}\)?)?\s?\d{0,12}$/;
        return pattern.test(phoneNumber);
    },

    // Hàm kiểm tra ngày tháng năm sinh
    testDate(birthday: string) {
        const pattern = /^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/;
        return pattern.test(birthday);
    },
    testPassword(password: string) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/;
        return pattern.test(password);
    },
    testUserName(username: string) {
        const pattern = /^[a-zA-Z][a-zA-Z0-9_]{4,}$/;
        return pattern.test(username);
    },
    convertResourceFile(numberConvert: number) {
        const CONVERT_KB = numberConvert;
        const CONVERT_MB = ((CONVERT_KB) / (1024) * 10) / 10;
        const CONVERT_GB = (CONVERT_KB) / (1024 * 1024);
        if (CONVERT_GB >= 1) {
            return `${this.formatNumber(CONVERT_GB)}(gb)`;
        }
        if (CONVERT_MB >= 1) {
            return `${this.formatNumber(CONVERT_MB)}(mb)`;
        }
        return `${this.formatNumber(CONVERT_KB)}(kb)`;
    },
    isSyllable(chr) {
        const syllable = "aáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵ";
        return syllable.includes(chr);
    },
    boDauTiengViet1(chuoi) {
        const tiengVietCoDau = "aàáảãạâầấẩẫậăằắẳẵặeèéẻẽẹêềếểễệiìíỉĩịoòóỏõọôồốổỗộơờớởỡợuùúủũụưừứửữựyỳýỷỹỵ";
        const tiengVietKhongDau = "aaaaaaaaaaaaaaaaaaeeeeeeeeeeeeiiiiiioooooooooooooooooouuuuuuuuuuuuyyyyyy";

        for (let i = 0; i < tiengVietCoDau.length; i++) {
            chuoi = chuoi.replace(new RegExp(tiengVietCoDau[i], "g"), tiengVietKhongDau[i]);
        }

        return chuoi;
    },
    boDauTiengViet(chuoi) {
        const tiengVietCoDau = "aàáảãạâầấẩẫậăằắẳẵặeèéẻẽẹêềếểễệiìíỉĩịoòóỏõọôồốổỗộơờớởỡợuùúủũụưừứửữựyỳýỷỹỵ";
        const tiengVietKhongDau = "aaaaaaââââââăăăăăăeeeeeeêêêêêêiiiiiiooooooôôôôôôơơơơơơuuuuuuưưưưưưyyyyyy";

        for (let i = 0; i < tiengVietCoDau.length; i++) {
            chuoi = chuoi.replace(new RegExp(tiengVietCoDau[i], "g"), tiengVietKhongDau[i]);
        }

        return chuoi;
    },
    // CÒN 2 TRƯỜNG HỢP LÀ: CHỮ ĐẦU LÀ SỐ VÀ TÊN SÁCH CHỈ CÓ 1 KÝ TỰ.
    titleEncode(title: string) {
        const titleSplited = title.split(" ");

        // KIỂM TRA XEM CÓ ĐỦ ÍT NHẤT 1 TỪ TRONG TIÊU ĐỀ
        if (titleSplited.length < 0) {
            return "Chưa nhập tiêu đề";
        }
        //MÃ HÓA CHO TIÊU ĐỀ CÓ 1 TỪ
        if (titleSplited.length == 1) {
            // NẾU TIÊU ĐỀ BẮT ĐẦU BẰNG NGUYÊN ÂM
            if (AppConsts.isSyllable(this.boDauTiengViet(titleSplited[0][0]).toLowerCase())) {
                let phuAmTuDau = "";
                phuAmTuDau += this.boDauTiengViet(titleSplited[0][0].toLowerCase());
                let caTu = titleSplited[0].toLowerCase();
                caTu = this.boDauTiengViet(caTu);
                if (caTu in AppConsts.bangChuyenDoi) {
                    caTu = AppConsts.bangChuyenDoi[caTu]
                }
                const ketQua = phuAmTuDau.toUpperCase() + caTu;
                return ketQua;
            }
            // NẾU TIÊU ĐỀ BẮT ĐẦU BẰNG NGUYÊN ÂM
            else {
                let phuAmTuDau = "";
                if (AppConsts.phuAm.includes(titleSplited[0].slice(0, 2).toLowerCase())) {
                    phuAmTuDau += titleSplited[0].slice(0, 2);
                }
                else {
                    for (let i = 0; i < titleSplited[0].length; i++) {
                        if (AppConsts.isSyllable(titleSplited[0][i])) {
                            break;
                        }
                        phuAmTuDau += titleSplited[0][i];
                    }
                }
                let phanConLaiTuDau = titleSplited[0].slice(phuAmTuDau.length);
                phanConLaiTuDau = this.boDauTiengViet(phanConLaiTuDau);
                if (phanConLaiTuDau in AppConsts.bangChuyenDoi) {
                    phanConLaiTuDau = AppConsts.bangChuyenDoi[phanConLaiTuDau]
                }
                const ketQua = phuAmTuDau.toUpperCase() + phanConLaiTuDau;
                return ketQua;
            }
        }
        //MÃ HÓA CHO TIÊU ĐỀ CÓ 2 TỪ

        let phuAmTuDau = "";
        if (AppConsts.phuAm.includes(titleSplited[0].slice(0, 2).toLowerCase())) {
            phuAmTuDau += titleSplited[0].slice(0, 2);
        }
        else {
            for (let i = 0; i < titleSplited[0].length; i++) {
                if (AppConsts.isSyllable(titleSplited[0][i])) {
                    break;
                }
                phuAmTuDau += titleSplited[0][i];
            }
        }
        // Lấy phần còn lại của từ đầu, bỏ dấu
        let phanConLaiTuDau = titleSplited[0].slice(phuAmTuDau.length);
        phanConLaiTuDau = this.boDauTiengViet(phanConLaiTuDau);
        if (phanConLaiTuDau in AppConsts.bangChuyenDoi) {
            phanConLaiTuDau = AppConsts.bangChuyenDoi[phanConLaiTuDau]
        }

        let phuAmTuThuHai = "";
        if (phuAmTuDau.length == 1 && AppConsts.phuAm.includes(titleSplited[1].slice(0, 2).toLowerCase())) {
            phuAmTuThuHai += titleSplited[1].slice(0, 2);
        } else {

            for (let i = 0; i < titleSplited[1].length; i++) {
                if (AppConsts.isSyllable(titleSplited[1][i])) {
                    break;
                }
                phuAmTuThuHai += titleSplited[1][i];
                if (phuAmTuThuHai.length == 1) {
                    break;
                }
            }
        }

        // Kết hợp các phần đã lấy được
        const ketQua = phuAmTuDau.toUpperCase() + phanConLaiTuDau + phuAmTuThuHai.toUpperCase();
        return ketQua;

    },
    getAttachmentFromfile(id, key, ext, isdelete) {
        let a = new AttachmentItem();
        a.id = id;
        a.key = key;
        a.ext = ext;
        a.isdelete = isdelete;
        return a;
    }
};
export default AppConsts;
