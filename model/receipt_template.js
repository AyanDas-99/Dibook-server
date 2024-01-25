const PDFDocument = require('pdfkit-table');
const fs = require('fs');

class ReceiptTemplate {
   static async createPdf(orders, userId, paymentMethod) {
      /*
      order = [Order, Book]
      */

      const totalOrderValue = orders.reduce((acc, curr) => acc + curr[1].price, 0);

      const doc = new PDFDocument();

      // Header and logo
      doc.fillColor('green').font('./assets/fonts/JuliusSansOne-Regular.ttf').fontSize(20).text('DIBOOK', 70, 20);
      doc.fillColor('black').font('Helvetica-Bold').fontSize(12).text('Order Receipt', 70, 50);
      doc.moveDown(); // Add spacing

      // Additional Data
      doc.font('Helvetica');
      doc.fontSize(8).text(`Order Date: ${orders[0][0].createdAt}`);
      doc.text(`Customer User Id: ${userId}`);
      doc.moveDown();
      doc.moveDown();

      // Add itemized list of products
      const table = {
         options: {
            columnSpacing: 10,
            padding: 5, // {Number} default: 0
            divider: {

            }
         },
         headers:
            ['Product Name', 'Product Id', 'Quantity', 'Unit Price', 'Total Price', 'Order Id'],
         rows: [
            ...orders.map(order =>
               [`${order[1].name.slice(0, 20)} | ${order[1].user}`, order[1]._id, order[0].quantity, order[1].price, order[0].quantity * order[1].price, order[0]._id],
            ),
            ['Total Order Value', "Rs. " + totalOrderValue]
         ]
      };

      await doc.table(table, { columnsSize: [100, 100, 50, 50, 50, 100] });

      // Add summary section (subtotal, shipping, taxes, total)
      doc.moveDown();
      doc.text(`Total Order Value: Rs. ${totalOrderValue}`);
      doc.text(`Payment Method: ${paymentMethod}`)

      doc.moveDown();
      doc.text('Thank you for shopping at Dibook!');


      doc.end();
      return doc;
   }
}

module.exports = ReceiptTemplate;