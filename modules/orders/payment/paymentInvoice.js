const pdf = require('pdf-creator-node'),
    fs = require('fs'),
    template = fs.readFileSync("./storage/invoices/template.html", "utf-8");

module.exports = function createInvoice(data) {
    try {
        return pdf.create({
            html: template,
            data: data,
            path: `facture_${data._id}.pdf`
        }, {
            format: 'A4',
            orientation: 'portrait'
        })
    } catch(e) {
        throw new e;
    }
}