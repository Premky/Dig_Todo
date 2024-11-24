import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const XportArrestVehicles = async (data, office_name) => {
  // Check if data is valid
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return; // Early exit if there's no data
  }

  // Log data for debugging
  console.log('Data received for export:', data, office_name);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${office_name.office_name}`);

  // Add a header row with the office name
  worksheet.addRow([`पक्राउ परेका सवारी साधन रिपोर्ट - ${office_name.office_name}`]);
  // worksheet.mergeCells('A1:J1'); // Merge header row cells
  worksheet.getCell('A1').alignment = { horizontal: 'center' };
  worksheet.getCell('A1').font = { bold: true };

  // Define worksheet columns (this is done after the blank row)
  worksheet.columns = [
    { header: 'सि.नं.', key: 'sn', width: 10 },
    { header: 'मिति', key: 'date', width: 15 },
    { header: 'दर्जा', key: 'rank', width: 15 },
    { header: 'नामथर', key: 'name', width: 20 },
    { header: 'सवारी नं.', key: 'vehicle_no', width: 15 },
    { header: 'कसुर', key: 'kasur', width: 25 },
    { header: 'सवारी चालक/धनी', key: 'owner', width: 20 },
    { header: 'सम्पर्क', key: 'contact', width: 15 },
    { header: 'चिट नं.', key: 'cheat', width: 15 },
    { header: 'फिर्ता मिति', key: 'ret_date', width: 25 },
    { header: 'लग्नेको नामथर', key: 'ret_name', width: 25 },
    { header: 'लग्नेको ठेगाना', key: 'ret_address', width: 25 },
    { header: 'लग्नेको सम्पर्क नं.', key: 'ret_contact', width: 25 },
    { header: 'कैफियत', key: 'remarks', width: 25 },
  ];

  // Style the column header row (set bold)
  worksheet.getRow(1).font = { bold: true }; // The second row now contains column headers

  // Add data rows
  data.forEach((row, index) => {
    worksheet.addRow({
      sn: index + 1,
      date: row.date,
      rank: row.rank_id,
      name: row.name,
      vehicle_no: row.vehicle_no,
      kasur: row.name_np,
      owner: row.owner,
      contact: row.contact,
      cheat: row.voucher,
      ret_date: row.return_date,
      ret_name: row.return_name,
      ret_address: row.return_address,
      ret_contact: row.return_contact,
      remarks: row.remarks,
    });
  });

  // Finalize and save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ArrestedVehicles.xlsx');
};

export default XportArrestVehicles;
