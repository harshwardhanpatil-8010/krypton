import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export const downloadTransactionInvoice = (transactions = []) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Transaction Invoice', 14, 22);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [['#', 'Txn ID', 'Crypto', 'Amount', 'Type', 'Network']],
    body: transactions.map((tx, index) => [
      index + 1,
      tx.tnx_id,
      tx.crypto,
      tx.tnx_amount,
      tx.tnx_type,
      tx.network,
    ]),
  });

  doc.save('transaction_invoice.pdf');
};
