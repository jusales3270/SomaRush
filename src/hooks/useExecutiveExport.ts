import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExecutiveReport } from '../types';

export const useExecutiveExport = () => {
    const exportPDF = async (report: ExecutiveReport, elementId: string) => {
        try {
            const element = document.getElementById(elementId);
            if (!element) throw new Error("Element not found");

            // Optimization for PDF rendering to avoid clipping
            const canvas = await html2canvas(element, {
                scale: 2, // higher resolution
                useCORS: true,
                backgroundColor: '#050505', // dark theme background
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            // Multi-page capability
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            pdf.save(`${report.brand}_LLM_Authority_Report_v1.0.pdf`);

            return true;
        } catch (error) {
            console.error("Failed to export PDF", error);
            return false;
        }
    };

    return { exportPDF };
};
