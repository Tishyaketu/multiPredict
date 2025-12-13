import fs from 'fs';
import pdf from 'pdf-parse';

const filePath = '/home/tish/thas/Multi-Predict/ML/datasets/Diabetes/row1.pdf';

if (fs.existsSync(filePath)) {
    const dataBuffer = fs.readFileSync(filePath);
    pdf(dataBuffer).then(function (data) {
        console.log("PDF Content Start:");
        console.log(data.text);
        console.log("PDF Content End");
    }).catch(err => {
        console.error("Error parsing PDF:", err);
    });
} else {
    console.log("File not found:", filePath);
}
