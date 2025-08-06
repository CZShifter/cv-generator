import {
  SELLER_COMPANY,
  SELLER_IC,
  SELLER_ADDRESS,
  SELLER_ADDRESS_CITY,
  SELLER_LEGAL_NOTE,
  SELLER_LEGAL_NOTE_2,
  PRICE_CV,
} from "@/config/site";

export interface InvoiceData {
  invoiceNumber: string; // např. "251"
  date: Date;
}

export function renderInvoiceHtml({
  invoiceNumber,
  date,
}: InvoiceData): string {
  const formattedDate = date.toLocaleDateString("cs-CZ");

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <title>Doklad o zaplacení ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size:12px; color:#333; margin:0; padding:20px; }
    h1 { margin-bottom:10px; }
    table { width:100%; border-collapse:collapse; margin:20px 0; }
    th, td { border:1px solid #ccc; padding:5px; }
    th { background:#f5f5f5; }
    .right { text-align:right; }
    .note { font-size:10px; color:#555; margin-top:10px; }
  </style>
</head>
<body>
  <h1>Doklad o zaplacení č. ${invoiceNumber}</h1>
  <p>
  Datum vystavení: ${formattedDate}<br/>
  Datum uskutečnění platby: ${formattedDate}</p>
  <h2>Dodavatel</h2>
  <p>
    ${SELLER_COMPANY}<br/>
    IČ: ${SELLER_IC}<br/>
    ${SELLER_ADDRESS}<br/>
    ${SELLER_ADDRESS_CITY}
  </p>
  <p class="note">
  ${SELLER_LEGAL_NOTE}<br/>
  ${SELLER_LEGAL_NOTE_2}
  </p>

  <table>
    <thead>
      <tr>
        <th>Popis</th><th>Množství</th><th>Cena za kus</th><th>Celkem</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Vytvoření životopisu v on-line aplikaci RychlýŽivotopis.cz</td>
        <td style="text-align:right;">1</td>
        <td style="text-align:right;">${PRICE_CV.toFixed(2)} Kč</td>
        <td style="text-align:right;">${PRICE_CV.toFixed(2)} Kč</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="right">Celkem uhrazeno</td>
        <td class="right">${PRICE_CV.toFixed(2)} Kč</td>
      </tr>
    </tfoot>
  </table>
  <p>Děkujeme za Vaši objednávku.</p>
</body>
</html>`;
}
