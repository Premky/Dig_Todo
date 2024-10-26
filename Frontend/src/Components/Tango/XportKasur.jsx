import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // For saving the file on the client side

const XportKasur = async (data, office_name) => {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // 1. Add the office name in the first row and merge across all vehicle columns
  const totalColumns = data.length * 2 + 1; // Multiply by 2 (for count and tax) and add 1 for 'कार्यालय'
  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell('A1').value = `${office_name}`; // Office name at the top
  worksheet.getCell('A1').font = { size: 14, bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

  // 2. Add the "कार्यालय" header in the second row
  worksheet.getCell('A2').value = 'कार्यालय';
  worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

  // 3. Start adding vehicle names and merging cells for each vehicle name
  let startCol = 2; // Starting from the second column (skip 'कार्यालय')
  data.forEach((vehicle, index) => {
    const vehicleStartCol = startCol;
    const vehicleEndCol = startCol + 1; // Merge across 2 columns (Count, Tax/Fine)

    // Merge vehicle name across two columns and align center (row 2)
    worksheet.mergeCells(2, vehicleStartCol, 2, vehicleEndCol);
    worksheet.getCell(2, vehicleStartCol).value = vehicle.name_np;
    worksheet.getCell(2, vehicleStartCol).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add "Count" and "Tax/Fine" as sub-headers in the third row
    worksheet.getCell(3, vehicleStartCol).value = 'संख्या';
    worksheet.getCell(3, vehicleEndCol).value = 'राजश्व';

    // Adjust the columns' width
    worksheet.getColumn(vehicleStartCol).width = 10;
    worksheet.getColumn(vehicleEndCol).width = 10;

    startCol += 2; // Move to the next vehicle (2 columns for each vehicle)
  });

  // 4. Add data rows (starting from row 4) and populate office_id in the first column
  data.forEach((vehicleRow, rowIndex) => {
    const rowNumber = rowIndex + 4; // Start from row 4 (since rows 1-3 are headers)
    
    // Add office_id in the first column (A)
    worksheet.getCell(`A${rowNumber}`).value = vehicleRow.office_name;

    // Add count and tax/fine values for each vehicle
    data.forEach((vehicle, colIndex) => {
      const countCol = 2 + colIndex * 2; // Skip 'कार्यालय' and find the count column
      const fineCol = countCol + 1; // Tax/Fine column comes right after the count column

      worksheet.getCell(rowNumber, countCol).value = vehicle.count; // Add count
      worksheet.getCell(rowNumber, fineCol).value = vehicle.fine;   // Add fine
    });
  });

  // 5. Generate the Excel file as a Blob
  const buffer = await workbook.xlsx.writeBuffer();

  // 6. Use FileSaver to save the file on the client side
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'PunishmentData.xlsx');
};

export default XportKasur;
