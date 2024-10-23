import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // For saving the file on client-side

const XportKasur = async (data) => {
    const convertToNepaliDate = (isoDate) => {
        if (!isoDate) {
            return 'null';
        } else {
            const datePart = isoDate.split('T')[0]; // Extract just the date part
            return datePart; // Return in the format needed for the NepaliDatePicker)
        }
    }
        ;

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define columns
    worksheet.columns = [
        { header: 'जिल्ला', key: 'district', width: 10 },
        { header: 'मिति', key: 'date', width: 20 },
        { header: 'कारवाही', key: 'vehicle', width: 20 },
        { header: 'संख्या', key: 'count', width: 10 },
        { header: 'राजस्व', key: 'fine', width: 15 }
    ];

    // Add rows (you can customize this to match your data structure)
    data.forEach((item, index) => {
        worksheet.addRow({
            district: index + 1,
            date: convertToNepaliDate(item.date),
            vehicle: item.name_np,
            count: item.count,
            fine: item.fine
        });
    });

    // Generate the Excel file as a Blob
    const buffer = await workbook.xlsx.writeBuffer();

    // Use FileSaver to save the file on client side
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'PunishmentData.xlsx');
};

export default XportKasur;