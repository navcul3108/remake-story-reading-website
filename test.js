const path = require("path");
const wordToHtml = require("word-to-html")
const mammoth = require("mammoth")
const fs = require("fs")

docx_path = path.join(__dirname, "CTDL.docx")
//wordToHtml(docx_path, {tdVerticalAlign:'top'})
mammoth.convertToHtml({path:docx_path})
    .then(result=>{
        fs.writeFileSync("CTDL.html", result.value);
        console.log(result.messages)
    })
    .done()