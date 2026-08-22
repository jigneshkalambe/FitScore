import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

async function extractTextFromFile(buffer, mimetype) {
    if (mimetype === "application/pdf") {
        return extractFromPDF(buffer);
    }

    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return extractFromDOCX(buffer);
    }

    throw new Error("Unsupported file type");
}

async function extractFromPDF(buffer) {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text;
}

async function extractFromDOCX(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

export { extractTextFromFile };
