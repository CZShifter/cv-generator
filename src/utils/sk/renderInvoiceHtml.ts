import {
  SELLER_COMPANY,
  SELLER_IC,
  SELLER_ADDRESS,
  SELLER_ADDRESS_CITY,
  SELLER_LEGAL_NOTE_SK,
  SELLER_LEGAL_NOTE_2_SK,
  PRICE_CV_SK,
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
  <title>Doklad o zaplatení ${invoiceNumber}</title>
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
  <h1>Doklad o zaplatení č. ${invoiceNumber}</h1>
  <p>
  Dátum vystavenia: ${formattedDate}<br/>
  Dátum uskutočnenia platby: ${formattedDate}</p>
  <h2>Dodávateľ</h2>
  <p>
    ${SELLER_COMPANY}<br/>
    IČ: ${SELLER_IC}<br/>
    ${SELLER_ADDRESS}<br/>
    ${SELLER_ADDRESS_CITY}
  </p>
  <p class="note">
  ${SELLER_LEGAL_NOTE_SK}<br/>
  ${SELLER_LEGAL_NOTE_2_SK}
  </p>

  <table>
    <thead>
      <tr>
        <th>Popis</th><th>Množstvo</th><th>Cena za kus</th><th>Celkom</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Vytvorenie životopisu v online aplikácii RychlýŽivotopis.sk</td>
        <td style="text-align:right;">1</td>
        <td style="text-align:right;">${PRICE_CV_SK.toFixed(2)} €</td>
        <td style="text-align:right;">${PRICE_CV_SK.toFixed(2)} €</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="right">Celkom uhradené</td>
        <td class="right">${PRICE_CV_SK.toFixed(2)} €</td>
      </tr>
    </tfoot>
  </table>
  <p>Ďakujeme za Vašu objednávku.</p>
</body>
</html>`;
}
