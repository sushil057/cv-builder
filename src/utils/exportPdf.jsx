import { renderToStaticMarkup } from 'react-dom/server';
import CVDocument from '../components/CVDocument';
import { esc } from '../utils/helpers';

const CV_CSS = `
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#222;line-height:1.4;background:#fff;}
.ep{padding:28px 36px 40px 36px;width:800px;}
.ep-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.ep-header-left{display:flex;align-items:flex-start;gap:16px;}
.ep-photo{width:90px;height:110px;border:1px solid #bbb;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#e8e8e8;}
.ep-photo img{width:100%;height:100%;object-fit:cover;object-position:top;}
.ep-name-block h1{font-size:22px;font-weight:bold;color:#003399;margin-bottom:9px;margin-top:4px;}
.ep-info{font-size:10.5px;line-height:1.75;}.ep-info b{font-weight:bold;}.ep-info .sep{color:#aaa;margin:0 5px;}
.ep-logo{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
.ep-logo-flag{width:52px;height:34px;background:#003399;border-radius:2px;overflow:hidden;}
.ep-logo-flag svg{width:52px;height:34px;display:block;}
.ep-logo-text{font-size:20px;font-weight:bold;color:#003399;letter-spacing:.4px;}
.ep-section{margin-bottom:10px;}
.ep-section-hdr{display:flex;align-items:center;gap:8px;border-bottom:1.5px solid #003399;padding-bottom:3px;margin-bottom:8px;}
.ep-dot{width:9px;height:9px;background:#003399;border-radius:50%;flex-shrink:0;}
.ep-section-title{font-size:11px;font-weight:bold;color:#003399;text-transform:uppercase;letter-spacing:.5px;}
.ep-body{padding-left:17px;}
.ep-edu-item{margin-bottom:7px;}.ep-edu-dates{font-size:10px;color:#555;margin-bottom:1px;}
.ep-edu-row{display:flex;justify-content:space-between;align-items:baseline;}
.ep-edu-degree{font-weight:bold;font-size:11px;}.ep-edu-inst{color:#555;font-size:10.5px;}
.ep-edu-divider{border:none;border-top:1px solid #e0e0e0;margin:4px 0;}
.ep-edu-bullets{padding-left:12px;margin:3px 0;}.ep-edu-bullets li{font-size:10.5px;list-style:disc;padding:1px 0;}
.ep-edu-field{font-size:10.5px;margin-top:3px;}.ep-edu-field b{font-weight:bold;}
.ep-job-item{margin-bottom:9px;}.ep-job-row{display:flex;justify-content:space-between;align-items:baseline;}
.ep-job-title{font-weight:bold;font-size:11px;}.ep-job-meta{font-size:10px;color:#555;}
.ep-job-divider{border:none;border-top:1px solid #ccc;margin:4px 0;}
.ep-job-bullets{margin:3px 0;padding-left:0;}.ep-job-bullets li{font-size:10.5px;list-style:none;padding:1.5px 0;}.ep-job-bullets li::before{content:"• ";}
.ep-skills-cat{font-size:10.5px;font-weight:bold;margin:5px 0 3px;}.ep-skills-list{font-size:10.5px;}.ep-skills-sep{color:#999;margin:0 5px;}
.ep-digital-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #f0f0f0;}
.ep-digital-row:last-of-type{border-bottom:none;}
.ep-digital-left{font-size:10.5px;display:flex;align-items:center;gap:6px;}.ep-digital-icon{font-size:12px;}
.ep-digital-right{display:flex;align-items:center;gap:8px;}
.ep-digital-level{font-size:10.5px;font-weight:bold;color:#003399;}.ep-digital-score{font-size:10.5px;color:#555;}
.ep-digital-note{font-size:9px;color:#888;font-style:italic;margin-top:5px;}
.ep-lang-table{width:100%;border-collapse:collapse;font-size:10.5px;}
.ep-lang-table th{background:#003399;color:#fff;text-align:center;padding:4px 6px;font-size:9.5px;font-weight:bold;text-transform:uppercase;}
.ep-lang-table th.ep-lang-left{text-align:left;}
.ep-lang-table .ep-lang-subhdr th{background:#4472c4;font-weight:normal;font-size:9px;padding:3px 6px;}
.ep-lang-table td{text-align:center;padding:4px 6px;border:1px solid #d0d0d0;font-size:10.5px;}
.ep-lang-table td.ep-lang-name{text-align:left;font-weight:bold;background:#fff;}
.ep-lang-note{font-size:9px;color:#666;font-style:italic;margin-top:5px;}
.ep-mother{font-size:10.5px;margin-bottom:5px;}.ep-other-label{font-size:10.5px;margin-bottom:5px;}
.ep-vol-date{font-size:10px;color:#555;margin-bottom:2px;}.ep-vol-title{font-weight:bold;font-size:11px;margin-bottom:3px;}.ep-vol-desc{font-size:10.5px;}
.ep-about{font-size:10.5px;}.ep-driving{font-size:10.5px;}
@media print{@page{size:A4;margin:0;}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
`;

export function exportPdf(cv) {
  const cvName = (cv.name || 'CV').replace(/[^a-z0-9_\-\s]/gi, '').trim() || 'CV';
  const markup = renderToStaticMarkup(<CVDocument cv={cv} />);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(cv.name || 'CV')}</title>
<style>${CV_CSS}</style>
</head>
<body>
${markup}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');

  if (win) {
    win.addEventListener('load', () => {
      win.focus();
      win.print();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = cvName + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    alert(
      'Your CV has been downloaded as an HTML file.\nOpen it in Chrome or Edge, then press Ctrl+P and choose "Save as PDF".',
    );
  }
}
