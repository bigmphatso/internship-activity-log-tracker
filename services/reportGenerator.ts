
import { Internship, User, Week } from '../types';

declare global {
    interface Window {
        jspdf: any;
        XLSX: any;
    }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
};

const isLogEmpty = (log: Record<string, string>): boolean => {
    if (!log) return true;
    return Object.values(log).every(val => val.trim() === '');
}

// --- PDF Generation ---

export const generateOverallPdf = (internship: Internship, user: User) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const { logFields } = internship;

  doc.setFontSize(22);
  doc.text('Internship Activity Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`Intern: ${user.fullName || user.username}`, 105, 30, { align: 'center' });
  doc.text(`Location: ${internship.location}`, 105, 38, { align: 'center' });
  
  const startDate = new Date(internship.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + internship.totalWeeks * 7 - 1);
  doc.text(`Duration: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 105, 46, { align: 'center' });

  const head = [['Week', 'Date', ...logFields]];
  const body: any[] = [];
  internship.weeks.forEach(week => {
      if (week.summary) {
          body.push([{ 
              content: `Week ${week.weekNumber} Summary: ${week.summary}`, 
              colSpan: head[0].length, 
              styles: { fontStyle: 'italic', fillColor: [245, 245, 245], textColor: [50, 50, 50], halign: 'left' } 
          }]);
      }
      week.days.forEach(day => {
          const row = [
              `Week ${week.weekNumber}`,
              formatDate(day.date),
              ...logFields.map(field => day.log[field] || '')
          ];
          if (!isLogEmpty(day.log)) {
             body.push(row);
          }
      });
  });

  doc.autoTable({
    startY: 60,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [22, 22, 22] },
    didParseCell: (data: any) => {
        // Make text in log fields smaller
        if (data.section === 'body' && data.column.index >= 2) {
             data.cell.styles.fontSize = 8;
        }
    }
  });

  doc.save(`Internship_Report_${internship.location.replace(/\s/g, '_')}.pdf`);
};

export const generateWeeklyPdf = (internship: Internship, weekNumber: number, user: User) => {
  const week = internship.weeks.find(w => w.weekNumber === weekNumber);
  if (!week) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const { logFields } = internship;
  
  doc.setFontSize(20);
  doc.text(`Weekly Report - Week ${weekNumber}`, 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Intern: ${user.fullName || user.username}`, 105, 30, { align: 'center' });
  doc.text(`Location: ${internship.location}`, 105, 38, { align: 'center' });

  let startY = 50;
  if (week.summary) {
    doc.setFontSize(10);
    doc.setFillColor(245, 245, 245);
    const summaryLines = doc.splitTextToSize(week.summary, 182);
    const summaryHeight = summaryLines.length * 5 + 8;
    doc.rect(14, 48, 182, summaryHeight, 'F');
    doc.text('Weekly Summary:', 18, 54);
    doc.text(summaryLines, 18, 60);
    startY = 52 + summaryHeight;
  }

  const head = [['Date', ...logFields]];
  const tableData = week.days
    .filter(day => !isLogEmpty(day.log))
    .map(day => [
        formatDate(day.date),
        ...logFields.map(field => day.log[field] || '')
    ]);

  doc.autoTable({
    startY: startY,
    head: head,
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 22, 22] },
    didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index >= 1) {
             data.cell.styles.fontSize = 8;
        }
    }
  });

  doc.save(`Internship_Report_Week_${weekNumber}.pdf`);
};


// --- Excel Generation ---

export const generateOverallExcel = (internship: Internship, user: User) => {
  const { logFields } = internship;

  const header = [
    { A1: 'Internship Activity Report' },
    { A2: `Intern: ${user.fullName || user.username}` },
    { A3: `Location: ${internship.location}` },
    {} // Empty row
  ];

  const data = internship.weeks.flatMap(week => {
    const weekRows: any[] = [];
    if (week.summary) {
        const summaryRow: any = { 'Week': `Week ${week.weekNumber} Summary`, 'Date': week.summary };
        logFields.forEach(field => summaryRow[field] = '');
        weekRows.push(summaryRow);
    }
    week.days.forEach(day => {
        if (!isLogEmpty(day.log)) {
            const dayRow: any = {
                'Week': `Week ${week.weekNumber}`,
                'Date': formatDate(day.date),
            };
            logFields.forEach(field => dayRow[field] = day.log[field] || '');
            weekRows.push(dayRow);
        }
    });
    return weekRows;
  });
  
  const worksheet = window.XLSX.utils.json_to_sheet(data, {origin: 'A5'});
  window.XLSX.utils.sheet_add_json(worksheet, header, {skipHeader: true});

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Overall Report');
  
  const colWidths = [ {wch: 20}, {wch: 25}, ...logFields.map(() => ({wch: 50})) ];
  worksheet['!cols'] = colWidths;
  
  window.XLSX.writeFile(workbook, `Internship_Report_${internship.location.replace(/\s/g, '_')}.xlsx`);
};


export const generateWeeklyExcel = (internship: Internship, weekNumber: number, user: User) => {
  const week = internship.weeks.find(w => w.weekNumber === weekNumber);
  if (!week) return;
  const { logFields } = internship;
  
  let origin = 'A5';
  const header: any[] = [
    { A1: `Weekly Report - Week ${weekNumber}` },
    { A2: `Intern: ${user.fullName || user.username}` },
    { A3: `Location: ${internship.location}` },
    {} // Empty row
  ];
  
  if (week.summary) {
    header.push({ A4: 'Summary:' });
    header.push({ A5: week.summary });
    header.push({}); // Empty row
    origin = 'A8';
  }
  
  const data = week.days
    .filter(day => !isLogEmpty(day.log))
    .map(day => {
        const row: any = { 'Date': formatDate(day.date) };
        logFields.forEach(field => row[field] = day.log[field] || '');
        return row;
    });

  const worksheet = window.XLSX.utils.json_to_sheet(data, {origin});
  window.XLSX.utils.sheet_add_json(worksheet, header, {skipHeader: true});

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, `Week ${weekNumber} Report`);

  const colWidths = [ {wch: 25}, ...logFields.map(() => ({wch: 75})) ];
  worksheet['!cols'] = colWidths;
  
  window.XLSX.writeFile(workbook, `Internship_Report_Week_${weekNumber}.xlsx`);
};
