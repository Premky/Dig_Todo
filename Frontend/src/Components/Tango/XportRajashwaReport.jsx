import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const XportRajashwaReport = async (data, office_name) => {
  // Check if data is valid
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return; // Early exit if there's no data
  }
  
  // Log data for debugging
  console.log('Data received for export:', data);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('कसुर रिपोर्ट');

  // Ensure vehicles is an array for the first office
  const vehicles = Object.entries(data[0].vehicles || {}).map(([name, details]) => ({
    name_np: name,
    ...details
  }));

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    console.log(data);
    alert('No vehicles data available to export.');
    return; // Early exit if no vehicles
  }

  const totalColumns = vehicles.length * 2 + 1; // Total columns including vehicle count and fine
  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell('A1').value = office_name;
  worksheet.getCell('A1').font = { size: 14, bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.getCell('A2').value = 'कार्यालय';
  worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

  // Define headers for vehicles
  let startCol = 2;
  vehicles.forEach((vehicle) => {
    const vehicleStartCol = startCol;
    const vehicleEndCol = startCol + 1;

    worksheet.mergeCells(2, vehicleStartCol, 2, vehicleEndCol);
    worksheet.getCell(2, vehicleStartCol).value = vehicle.name_np;
    worksheet.getCell(2, vehicleStartCol).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell(3, vehicleStartCol).value = 'संख्या';
    worksheet.getCell(3, vehicleEndCol).value = 'राजश्व';

    worksheet.getColumn(vehicleStartCol).width = 15; // Adjust width as necessary
    worksheet.getColumn(vehicleEndCol).width = 15; // Adjust width as necessary

    startCol += 2;
  });

  // Process office data to accumulate counts and fines
  const officeData = data.reduce((acc, row) => {
    if (!acc[row.office_name]) {
      acc[row.office_name] = {};
      Object.entries(row.vehicles).forEach(([vehicleName, details]) => {
        acc[row.office_name][vehicleName] = { count: 0, fine: 0 };
      });
    }
    Object.entries(row.vehicles).forEach(([vehicleName, details]) => {
      acc[row.office_name][vehicleName].count += details.count; // Total count
      acc[row.office_name][vehicleName].fine += details.fine;   // Total fine
    });
    return acc;
  }, {});

  // Populate the worksheet with office data
  let rowIndex = 4; // Start from the 4th row for office data
  Object.keys(officeData).forEach((office) => {
    worksheet.getCell(`A${rowIndex}`).value = office; // Office name
    let colIndex = 2; // Start after office name
    Object.entries(officeData[office]).forEach(([vehicleName, values]) => {
      worksheet.getCell(rowIndex, colIndex).value = values.count; // Vehicle count
      worksheet.getCell(rowIndex, colIndex + 1).value = values.fine; // Fine amount
      colIndex += 2; // Move to the next vehicle
    });
    rowIndex++;
  });

  // Finalize and save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'PunishmentData.xlsx');
};

export default XportRajashwaReport;
