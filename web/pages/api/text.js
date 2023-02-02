// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    let pdfB64 = req.body.file.split(',');
    console.log(getText(pdfB64[1]))
    res.status(200).json({ name: req.body })
}
function getText(pdfData) {
    fetch(`${process.env.FLASK_SERVER_BASE}/text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: pdfData })
    });


    return ""
}
