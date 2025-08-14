// createfile_bm0901
function createfile_bm0901(params, rowRepair = null) {
    try{
    // Get template document
    
    const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_01);
    const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_01);
    const newWordFile = templateFile.makeCopy(`BB01_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
    const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
    const bodyNewWordFile = DocNewWordFile.getBody();
    const FooterNewWordFile = DocNewWordFile.getFooter();

    // Kiểm tra xem có dữ liệu rowRepair không
    if (rowRepair) { // Xóa file trong link
        console.log("[createfile_bm0901] - Có dữ liệu rowRepair, sử dụng rowRepair để tạo biên bản");
        // Xóa file cũ nếu có
        const oldWordFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Word_BB01];
        console.log("[createfile_bm0901] - oldWordFileUrl:", oldWordFileUrl);
        const oldPdfFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB01];
        console.log("[createfile_bm0901] - oldPdfFileUrl:", oldPdfFileUrl);
        if (oldWordFileUrl) {
            const oldWordFileId = oldWordFileUrl.match(/[-\w]{25,}/)[0];
            const oldWordFile = DriveApp.getFileById(oldWordFileId);
            oldWordFile.setTrashed(true);
            console.log("[createfile_bm0901] - Đã xóa file Word cũ:", oldWordFile.getName());
        }
        if (oldPdfFileUrl) {
            const oldPdfFileId = oldPdfFileUrl.match(/[-\w]{25,}/)[0];
            const oldPdfFile = DriveApp.getFileById(oldPdfFileId);
            oldPdfFile.setTrashed(true);
            console.log("[createfile_bm0901] - Đã xóa file PDF cũ:", oldPdfFile.getName());
        }
    }

    // Replace placeholders in the document
    const [time, date] = params.ngaydonvibao.split(' ');
    const [day, month, year] = date.split('/');
    // Prepare replacement data
    const replacements = {
      "{{Đơn vị yêu cầu}}": params.nameuserdv,
      "{{today}}": day,
      "{{month}}": month,
      "{{year}}": year,
      "{{Tên thiết bị}}": params.nameThietbi,
      "{{Model}}": params.nameModel,
      "{{Serial}}": params.nameSerial,
      "{{Hãng sản xuất}}": params.nameHangSX,
      "{{Nước sản xuất}}": params.nameNuocSX,
      "{{Năm sản xuất}}": params.nameNamSX,
      "{{Năm sử dụng}}": params.nameNamSD,
    };
    console.log("[createfile_bm0901] - Replacements data:", replacements);
    // Replace placeholders in the footer if it exists
    FooterNewWordFile.replaceText("{{id}}", params.repairID);
    // Replace placeholders in the document body
    for (const [placeholder, value] of Object.entries(replacements)) {
        if (value === undefined || value === null) {
            bodyNewWordFile.replaceText(placeholder, "");
        } else {
            bodyNewWordFile.replaceText(placeholder, value.toString());
        }
    }
    DocNewWordFile.saveAndClose();

    // Convert to PDF
    const pdfFile = DriveApp.getFileById(DocNewWordFile.getId()).getBlob().getAs('application/pdf');
    const FolderPdf = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Pdf_01);
    const pdfFileName = `BB01_${params.repairID}_${params.ngaydonvibao}.pdf`;
    const newPdfFile = FolderPdf.createFile(pdfFile.setName(pdfFileName));

    // Gán quyên truy cập cho người dùng, ai có link đều có thể xem
    newPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfFileUrl = newPdfFile.getUrl();
    const wordFileUrl = newWordFile.getUrl();
    console.log("[createfile_bm0901] - Đã tạo biên bản đề nghị sửa chữa:", pdfFileUrl, wordFileUrl);
    return {
        status: "success",
        pdfFileUrl: pdfFileUrl,
        wordFileUrl: wordFileUrl,
    }

    } catch (error) {
        console.error("[createfile_bm0901] - Lỗi khi tạo biên bản đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản đề nghị sửa chữa: " + error.message };
    }
}


// createfile_bm0902
function createfile_bm0902(params, rowRepair = null) {
    try{
    // Get template document
    const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_02);
    const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_02);
    const newWordFile = templateFile.makeCopy(`BB02_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
    const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
    const bodyNewWordFile = DocNewWordFile.getBody();
    const FooterNewWordFile = DocNewWordFile.getFooter();

    // Kiểm tra xem có dữ liệu rowRepair không
    if (rowRepair) { // Xóa file trong link
        console.log("[createfile_bm0902] - Có dữ liệu rowRepair, sử dụng rowRepair để tạo biên bản");
        // Xóa file cũ nếu có
        const oldWordFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Word_BB02];
        console.log("[createfile_bm0902] - oldWordFileUrl:", oldWordFileUrl);
        const oldPdfFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB02];
        console.log("[createfile_bm0902] - oldPdfFileUrl:", oldPdfFileUrl);
        if (oldWordFileUrl) {
            const oldWordFileId = oldWordFileUrl.match(/[-\w]{25,}/)[0];
            const oldWordFile = DriveApp.getFileById(oldWordFileId);
            oldWordFile.setTrashed(true);
            console.log("[createfile_bm0902] - Đã xóa file Word cũ:", oldWordFile.getName());
        }
        if (oldPdfFileUrl) {
            const oldPdfFileId = oldPdfFileUrl.match(/[-\w]{25,}/)[0];
            const oldPdfFile = DriveApp.getFileById(oldPdfFileId);
            oldPdfFile.setTrashed(true);
            console.log("[createfile_bm0901] - Đã xóa file PDF cũ:", oldPdfFile.getName());
        }
    }
    //params.ngaydonvibao
    console.log("[createfile_bm0902] - Ngày đơn vị báo:", params.ngaydonvibao);
    // Replace placeholders in the document
    const [time_dvBao, date_dvBao] = params.ngaydonvibao.split(' ');
    const [day_dvBao, month_dvBao, year_dvBao] = date_dvBao.split('/');
    console.log("[createfile_bm0902] - Thời gian đơn vị báo:", time_dvBao);
    console.log("[createfile_bm0902] - Ngày đơn vị báo:", day_dvBao, month_dvBao, year_dvBao);

    //mrDecisionDate
    const [time_mrDecisionDate, date_mrDecisionDate] = params.timeupdate.split(' ');
    const [day_mrDecisionDate, month_mrDecisionDate, year_mrDecisionDate] = date_mrDecisionDate.split('/');
    console.log("[createfile_bm0902] - Thời gian quyết định khảo sát:", time_mrDecisionDate);
    console.log("[createfile_bm0902] - Ngày quyết định khảo sát:", day_mrDecisionDate, month_mrDecisionDate, year_mrDecisionDate);

    // Prepare replacement data
    const replacements = {
    "{{day_ngaykhaosat}}": day_mrDecisionDate,
    "{{month_ngaykhaosat}}": month_mrDecisionDate,
    "{{year_ngaykhaosat}}": year_mrDecisionDate,
    "{{Đơn vị yêu cầu}}": params.nameuserdv,
    "{{day_ngaydvbao}}": day_dvBao,
    "{{month_ngaydvbao}}": month_dvBao,
    "{{year_ngaydvbao}}": year_dvBao,
    "{{Quyết định tổ khảo sát}}": params.mrDecisionFull,
    "{{Đại diện BV 1}}": params.mrDaiDienName1,
    "{{Chức vụ DD BV 1}}": params.mrDaiDienChucVu1,
    "{{Đại diện BV 2}}": params.mrDaiDienName2,
    "{{Chức vụ DD BV 2}}": params.mrDaiDienChucVu2,
    "{{Đại diện BV 3}}": params.mrDaiDienName3,
    "{{Chức vụ DD BV 3}}": params.mrDaiDienChucVu3,
    "{{Đại diện BV 4}}": params.mrDaiDienName4,
    "{{Chức vụ DD BV 4}}": params.mrDaiDienChucVu4,
    "{{Đại diện BV 5}}": params.mrDaiDienName5,
    "{{Chức vụ DD BV 5}}": params.mrDaiDienChucVu5,
    "{{Đại diện ĐV Báo sửa 1}}": params.dvDaiDienName1,
    "{{Chức vụ DD ĐV Báo sửa 1}}": params.dvDaiDienChucVu1,
    "{{Đại diện ĐV Báo sửa 2}}": params.dvDaiDienName2,
    "{{Chức vụ DD ĐV Báo sửa 2}}": params.dvDaiDienChucVu2,
    "{{Tên thiết bị}}": params.nameThietbi,
    "{{Model}}": params.nameModel,
    "{{Serial}}": params.nameSerial,
    "{{Hãng sản xuất}}": params.nameHangSX,
    "{{Nước sản xuất}}": params.nameNuocSX,
    "{{Năm sản xuất}}": params.nameNamSX,
    "{{Năm sử dụng}}": params.nameNamSD,
    "{{Tình trang thiết bị khảo sát}}": params.mrSurveyStatus,
    "{{Kết luận khảo sát}}": params.mrSurveyConclusion,
    "{{Đề xuất phương án}}": params.mrRepairProposal,
    //   "{{QR_CODE}}": generateQRCodeUrl(params.repairID),
      "{{id}}": params.repairID
    };
    console.log("[createfile_bm0902] - Replacements data:", replacements);
    // Replace placeholders in the footer if it exists
    FooterNewWordFile.replaceText("{{id}}", params.repairID);
    // Replace placeholders in the document body
    for (const [placeholder, value] of Object.entries(replacements)) {
        if (value === undefined || value === null) {
            bodyNewWordFile.replaceText(placeholder, "");
        } else {
            bodyNewWordFile.replaceText(placeholder, value.toString());
        }
    }
    DocNewWordFile.saveAndClose();

    // Convert to PDF
    const pdfFile = DriveApp.getFileById(DocNewWordFile.getId()).getBlob().getAs('application/pdf');
    const FolderPdf = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Pdf_02);
    const pdfFileName = `BB02_${params.repairID}_${params.ngaydonvibao}.pdf`;
    const newPdfFile = FolderPdf.createFile(pdfFile.setName(pdfFileName));

    // Gán quyên truy cập cho người dùng, ai có link đều có thể xem
    newPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfFileUrl = newPdfFile.getUrl();
    const wordFileUrl = newWordFile.getUrl();
    console.log("[createfile_bm0902] - Đã tạo biên bản đề nghị sửa chữa:", pdfFileUrl, wordFileUrl);
    return {
        status: "success",
        pdfFileUrl: pdfFileUrl,
        wordFileUrl: wordFileUrl,
    }

    } catch (error) {
        console.error("[createfile_bm0902] - Lỗi khi tạo biên bản đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản đề nghị sửa chữa: " + error.message };
    }
}

// createfile_bm0903
function createfile_bm0903(params, rowRepair = null) {
    try{
    // Get template document
    const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_03);
    const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_03);
    const newWordFile = templateFile.makeCopy(`BB03_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
    const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
    const bodyNewWordFile = DocNewWordFile.getBody();
    const FooterNewWordFile = DocNewWordFile.getFooter();

    // Kiểm tra xem có dữ liệu rowRepair không
    if (rowRepair) { // Xóa file trong link
        console.log("[createfile_bm0903] - Có dữ liệu rowRepair, sử dụng rowRepair để tạo biên bản");
        // Xóa file cũ nếu có
        const oldWordFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Word_BB03];
        console.log("[createfile_bm0903] - oldWordFileUrl:", oldWordFileUrl);
        const oldPdfFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB03];
        console.log("[createfile_bm0903] - oldPdfFileUrl:", oldPdfFileUrl);
        if (oldWordFileUrl) {
            const oldWordFileId = oldWordFileUrl.match(/[-\w]{25,}/)[0];
            const oldWordFile = DriveApp.getFileById(oldWordFileId);
            oldWordFile.setTrashed(true);
            console.log("[createfile_bm0903] - Đã xóa file Word cũ:", oldWordFile.getName());
        }
        if (oldPdfFileUrl) {
            const oldPdfFileId = oldPdfFileUrl.match(/[-\w]{25,}/)[0];
            const oldPdfFile = DriveApp.getFileById(oldPdfFileId);
            oldPdfFile.setTrashed(true);
            console.log("[createfile_bm0903] - Đã xóa file PDF cũ:", oldPdfFile.getName());
        }
    }
    //params.ngaydonvibao
    console.log("[createfile_bm0903] - Ngày đơn vị báo:", params.ngaydonvibao);
    // Replace placeholders in the document
    const [time_dvBao, date_dvBao] = params.ngaydonvibao.split(' ');
    const [day_dvBao, month_dvBao, year_dvBao] = date_dvBao.split('/');
    console.log("[createfile_bm0903] - Thời gian đơn vị báo:", time_dvBao);
    console.log("[createfile_bm0903] - Ngày đơn vị báo:", day_dvBao, month_dvBao, year_dvBao);

    //params.ngaykhaosat
    console.log("[createfile_bm0903] - Ngày khảo sát:", params.ngaykhaosat);
    // Replace placeholders in the document
    const [time_khaosat, date_khaosat] = params.ngaykhaosat.split(' ');
    const [day_khaosat, month_khaosat, year_khaosat] = date_khaosat.split('/');
    console.log("[createfile_bm0903] - Thời gian khảo sát:", time_khaosat);
    console.log("[createfile_bm0903] - Ngày khảo sát:", day_khaosat, month_khaosat, year_khaosat);

    //Content - Đê nghị
    const [time_Content, date_Content] = params.timeupdate.split(' ');
    const [day_Content, month_Content, year_Content] = date_Content.split('/');
    console.log("[createfile_bm0903] - Thời gian nội dung:", time_Content);
    console.log("[createfile_bm0903] - Ngày nội dung:", day_Content, month_Content, year_Content);

    // Prepare replacement data
    const replacements = {
        "{{Nội dung đề nghi}}": params.mrProposalContent,
    "{{day_ngaydenghi}}": day_Content,
    "{{month_ngaydenghi}}": month_Content,
    "{{year_ngaydenghi}}": year_Content,
    "{{Đơn vị yêu cầu}}": params.nameuserdv,
    "{{day_ngaydvbao}}": day_dvBao,
    "{{month_ngaydvbao}}": month_dvBao,
    "{{year_ngaydvbao}}": year_dvBao,
    "{{Quyết định tổ khảo sát}}": params.mrDecisionFull,
    "{{day_ngaykhaosat}}": day_khaosat,
    "{{month_ngaykhaosat}}": month_khaosat,
    "{{year_ngaykhaosat}}": year_khaosat,
    "{{Tên thiết bị}}": params.nameThietbi,
    "{{Model}}": params.nameModel,
    "{{Serial}}": params.nameSerial,
    "{{Hãng sản xuất}}": params.nameHangSX,
    "{{Nước sản xuất}}": params.nameNuocSX,
    "{{Năm sản xuất}}": params.nameNamSX,
    "{{Năm sử dụng}}": params.nameNamSD,
    "{{Tình trang thiết bị khảo sát}}": params.mrSurveyStatus,
    "{{Kết luận khảo sát}}": params.mrSurveyConclusion,
    "{{Đề xuất phương án}}": params.mrRepairProposal,
    "{{Người sửa chữa}}": params.nameNguoiSua,
};
console.log("[createfile_bm0902] - Replacements data:", replacements);
    // Replace placeholders in the document heder
    //   "{{QR_CODE}}": generateQRCodeUrl(params.repairID),
    FooterNewWordFile.replaceText("{{id}}", params.repairID);
    // Replace placeholders in the document body
    for (const [placeholder, value] of Object.entries(replacements)) {
        if (value === undefined || value === null) {
            bodyNewWordFile.replaceText(placeholder, "");
        } else {
            bodyNewWordFile.replaceText(placeholder, value.toString());
        }
    }

    DocNewWordFile.saveAndClose();

    // Convert to PDF
    const pdfFile = DriveApp.getFileById(DocNewWordFile.getId()).getBlob().getAs('application/pdf');
    const FolderPdf = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Pdf_02);
    const pdfFileName = `BB02_${params.repairID}_${params.ngaydonvibao}.pdf`;
    const newPdfFile = FolderPdf.createFile(pdfFile.setName(pdfFileName));

    // Gán quyên truy cập cho người dùng, ai có link đều có thể xem
    newPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfFileUrl = newPdfFile.getUrl();
    const wordFileUrl = newWordFile.getUrl();
    console.log("[createfile_bm0902] - Đã tạo biên bản đề nghị sửa chữa:", pdfFileUrl, wordFileUrl);
    return {
        status: "success",
        pdfFileUrl: pdfFileUrl,
        wordFileUrl: wordFileUrl,
    }

    } catch (error) {
        console.error("[createfile_bm0902] - Lỗi khi tạo biên bản đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản đề nghị sửa chữa: " + error.message };
    }
}

// createfile_bm0904
function createfile_bm0904(params, rowRepair = null) {
    try {
        // Get template document
        const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_04);
        const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_04);
        const newWordFile = templateFile.makeCopy(`BB04_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
        const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
        const bodyNewWordFile = DocNewWordFile.getBody();
        const FooterNewWordFile = DocNewWordFile.getFooter();

        // Kiểm tra xem có dữ liệu rowRepair không
        if (rowRepair) { // Xóa file trong link
            console.log("[createfile_bm0904] - Có dữ liệu rowRepair, sử dụng rowRepair để tạo biên bản");
            // Xóa file cũ nếu có
            const oldWordFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Word_BB04];
            console.log("[createfile_bm0904] - oldWordFileUrl:", oldWordFileUrl);
            const oldPdfFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB04];
            console.log("[createfile_bm0904] - oldPdfFileUrl:", oldPdfFileUrl);
            if (oldWordFileUrl) {
                const oldWordFileId = oldWordFileUrl.match(/[-\w]{25,}/)[0];
                const oldWordFile = DriveApp.getFileById(oldWordFileId);
                oldWordFile.setTrashed(true);
                console.log("[createfile_bm0904] - Đã xóa file Word cũ:", oldWordFile.getName());
            }
            if (oldPdfFileUrl) {
                const oldPdfFileId = oldPdfFileUrl.match(/[-\w]{25,}/)[0];
                const oldPdfFile = DriveApp.getFileById(oldPdfFileId);
                oldPdfFile.setTrashed(true);
                console.log("[createfile_bm0904] - Đã xóa file PDF cũ:", oldPdfFile.getName());
            }
        }

        // Ngày bàn giao
        const [time_bangiao, date_bangiao] = params.timeupdate.split(' ');
        const [day_bangiao, month_bangiao, year_bangiao] = date_bangiao.split('/');
        console.log("[createfile_bm0904] - Thời gian bàn giao:", time_bangiao);
        console.log("[createfile_bm0904] - Ngày bàn giao:", day_bangiao, month_bangiao, year_bangiao);

        // Prepare replacement data
        const replacements = {
            "{{day_ngaybangiao}}": day_bangiao,
            "{{month_ngaybangiao}}": month_bangiao,
            "{{year_ngaybangiao}}": year_bangiao,
            "{{Quyết định tổ khảo sát}}": params.mrDecisionFull,
            "{{Đơn vị yêu cầu}}": params.nameuserdv,
            "{{Đại diện BV 1}}": params.mrDaiDienName1,
            "{{Chức vụ DD BV 1}}": params.mrDaiDienChucVu1,
            "{{Đại diện BV 2}}": params.mrDaiDienName2,
            "{{Chức vụ DD BV 2}}": params.mrDaiDienChucVu2,
            "{{Đại diện BV 3}}": params.mrDaiDienName3,
            "{{Chức vụ DD BV 3}}": params.mrDaiDienChucVu3,
            "{{Đại diện BV 4}}": params.mrDaiDienName4,
            "{{Chức vụ DD BV 4}}": params.mrDaiDienChucVu4,
            "{{Đại diện BV 5}}": params.mrDaiDienName5,
            "{{Chức vụ DD BV 5}}": params.mrDaiDienChucVu5,
            "{{Đại diện ĐV Báo sửa 1}}": params.dvDaiDienName1,
            "{{Chức vụ DD ĐV Báo sửa 1}}": params.dvDaiDienChucVu1,
            "{{Đại diện ĐV Báo sửa 2}}": params.dvDaiDienName2,
            "{{Chức vụ DD ĐV Báo sửa 2}}": params.dvDaiDienChucVu2,
            "{{Tên thiết bị}}": params.nameThietbi,
            "{{Model}}": params.nameModel,
            "{{Serial}}": params.nameSerial,
            "{{Hãng sản xuất}}": params.nameHangSX,
            "{{Nước sản xuất}}": params.nameNuocSX,
            "{{Năm sản xuất}}": params.nameNamSX,
            "{{Năm sử dụng}}": params.nameNamSD,
            "{{Tình trang thiết bị khảo sát}}": params.mrSurveyStatus,
            "{{Tình trạng thiết bị bàn giao}}": params.mrDeviceStatusBG
        };
        
        console.log("[createfile_bm0904] - Replacements data:", replacements);
        
        // Replace placeholders in the footer if it exists
        FooterNewWordFile.replaceText("{{id}}", params.repairID);
        
        // Replace placeholders in the document body
        for (const [placeholder, value] of Object.entries(replacements)) {
            if (value === undefined || value === null) {
                bodyNewWordFile.replaceText(placeholder, "");
            } else {
                bodyNewWordFile.replaceText(placeholder, value.toString());
            }
        }

        DocNewWordFile.saveAndClose();

        // Convert to PDF
        const pdfFile = DriveApp.getFileById(DocNewWordFile.getId()).getBlob().getAs('application/pdf');
        const FolderPdf = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Pdf_04);
        const pdfFileName = `BB04_${params.repairID}_${params.ngaydonvibao}.pdf`;
        const newPdfFile = FolderPdf.createFile(pdfFile.setName(pdfFileName));

        // Gán quyền truy cập cho người dùng, ai có link đều có thể xem
        newPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const pdfFileUrl = newPdfFile.getUrl();
        const wordFileUrl = newWordFile.getUrl();
        console.log("[createfile_bm0904] - Đã tạo biên bản bàn giao thiết bị:", pdfFileUrl, wordFileUrl);
        
        return {
            status: "success",
            pdfFileUrl: pdfFileUrl,
            wordFileUrl: wordFileUrl,
        }

    } catch (error) {
        console.error("[createfile_bm0904] - Lỗi khi tạo biên bản bàn giao thiết bị:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản bàn giao thiết bị: " + error.message };
    }
}