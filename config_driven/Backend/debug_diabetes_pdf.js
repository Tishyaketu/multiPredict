
import fs from 'fs';
import pdf from 'pdf-parse';

const pdfPath = '/home/tish/thas/dynamic/ML/datasets/Diabetes/row1.pdf';

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    console.log("--- PDF TEXT START ---");
    console.log(data.text);
    console.log("--- PDF TEXT END ---");
});
