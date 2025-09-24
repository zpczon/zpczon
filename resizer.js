// Simplified resizer.js for PDF (client-side)
const pdfInput = document.getElementById('pdfFile');
const compressBtn = document.getElementById('compressBtn');
const downloadBtn = document.getElementById('downloadBtn');
const logEl = document.getElementById('log');
const targetSelect = document.getElementById('targetSize');
const startQualityInput = document.getElementById('startQuality');
if (window['pdfjsLib']) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';
}
function log(msg){ logEl.textContent += msg + "\n"; }
function bytesToKB(b){ return Math.round(b/1024); }
async function fileToArrayBuffer(file){
  return new Promise((resolve,reject)=>{
    const fr = new FileReader();
    fr.onload = ()=> resolve(fr.result);
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}
async function renderPageToCanvas(pdfDoc, pageNumber, scale){
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({scale: scale});
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  return canvas;
}
async function buildPdfFromCanvases(canvases, quality){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  for (let i=0;i<canvases.length;i++){
    const c = canvases[i];
    const dataUrl = c.toDataURL('image/jpeg', quality);
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);
    const imgW = pageWidth - 40;
    const imgH = (img.height * imgW) / img.width;
    if (i>0) pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', 20, 20, imgW, imgH);
  }
  return pdf;
}
async function compressPdfToTarget(file, targetBytes, startQuality=0.9){
  log('Original: ' + file.name + ' (' + bytesToKB(file.size) + ' KB)');
  const arrayBuf = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({data: arrayBuf}).promise;
  const numPages = pdfDoc.numPages;
  log('Pages: ' + numPages);
  const canvases = [];
  for (let p=1;p<=numPages;p++){
    const can = await renderPageToCanvas(pdfDoc, p, 1.0);
    canvases.push(can);
  }
  let quality = startQuality;
  let pdf, blob;
  while (quality > 0.2){
    pdf = await buildPdfFromCanvases(canvases, quality);
    blob = pdf.output('blob');
    if (blob.size <= targetBytes) break;
    quality -= 0.1;
  }
  return { blob, quality };
}
compressBtn.addEventListener('click', async ()=>{
  logEl.textContent = '';
  const file = pdfInput.files[0];
  if (!file){ alert('Upload PDF first'); return; }
  const target = parseInt(targetSelect.value);
  const startQ = parseFloat(startQualityInput.value);
  compressBtn.disabled = true;
  try {
    const result = await compressPdfToTarget(file, target, startQ);
    if (result && result.blob){
      log('Done. Final size: ' + bytesToKB(result.blob.size) + ' KB at quality ' + result.quality);
      const url = URL.createObjectURL(result.blob);
      downloadBtn.href = url;
      downloadBtn.download = file.name.replace(/\.pdf$/i,'') + '_compressed.pdf';
      downloadBtn.removeAttribute('disabled');
    } else {
      log('Failed.');
    }
  } catch(err){ alert(err); }
  compressBtn.disabled = false;
});
