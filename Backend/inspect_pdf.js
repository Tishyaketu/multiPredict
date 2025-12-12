import fs from 'fs';
import pdf from 'pdf-parse';

const dataBuffer = fs.readFileSync('/home/tish/thas/Multi-Predict/ML/datasets/Heart Disease/row1.pdf');

pdf(dataBuffer).then(function (data) {
    console.log("PDF Content Start:");
    console.log(data.text);
    console.log("PDF Content End");
}).catch(err => {
    console.error("Error:", err);
});
