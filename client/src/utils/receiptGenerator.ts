import { Order } from '../types';
import { formatPKR } from './currency';

export const generateReceiptPDF = (order: Order) => {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Please allow popups to download and print the receipt.');
    return;
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const tax = (order as any).taxPrice || 0;
  const courierPrice = order.shippingPrice !== undefined ? order.shippingPrice : 0;
  const itemsTotal = order.itemsPrice || order.orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const grandTotal = order.totalPrice || itemsTotal + tax + courierPrice;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt_INV-${order._id}_SM_Store</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #000000;
      background: #ffffff;
      line-height: 1.4;
      font-size: 13px;
      padding: 20px;
    }
    .receipt-container {
      max-width: 760px;
      margin: 0 auto;
      border: 2px solid #000000;
      padding: 24px 28px;
    }
    /* Header Section */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000000;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 12px;
      font-weight: 400;
      margin-top: 2px;
      color: #000000;
    }
    .helpline-box {
      margin-top: 8px;
      font-size: 12px;
    }
    .helpline-box strong {
      font-weight: 800;
    }
    .invoice-tag {
      text-align: right;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .invoice-meta {
      font-size: 12px;
      margin-top: 4px;
      font-weight: 400;
    }
    .invoice-meta strong {
      font-weight: 800;
    }

    /* Meta Grid */
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      border-bottom: 1px solid #000000;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .meta-block h4 {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 6px;
      border-bottom: 1px dashed #000000;
      padding-bottom: 2px;
      display: inline-block;
    }
    .meta-row {
      display: flex;
      margin-bottom: 3px;
      font-size: 12px;
    }
    .meta-label {
      width: 120px;
      font-weight: 700;
    }
    .meta-value {
      flex: 1;
      font-weight: 400;
    }

    /* Items Table */
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    table.items-table th {
      border-top: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 8px 6px;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      text-align: left;
    }
    table.items-table th.text-right,
    table.items-table td.text-right {
      text-align: right;
    }
    table.items-table th.text-center,
    table.items-table td.text-center {
      text-align: center;
    }
    table.items-table td {
      padding: 9px 6px;
      border-bottom: 1px solid #d0d0d0;
      font-size: 12px;
      vertical-align: top;
    }
    .item-name {
      font-weight: 800;
      font-size: 12.5px;
    }
    .item-desc {
      font-size: 11px;
      font-weight: 400;
      color: #333333;
      margin-top: 2px;
    }

    /* Summary Calculation */
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .summary-table {
      width: 320px;
      border-collapse: collapse;
    }
    .summary-table td {
      padding: 4px 6px;
      font-size: 12px;
    }
    .summary-table .sum-label {
      font-weight: 600;
      text-align: left;
    }
    .summary-table .sum-value {
      font-weight: 700;
      text-align: right;
    }
    .summary-table tr.total-row td {
      border-top: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 8px 6px;
      font-size: 15px;
      font-weight: 900;
    }

    /* Notes & Terms */
    .terms-box {
      border-top: 1px solid #000000;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 11px;
    }
    .terms-box h5 {
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 4px;
      font-size: 11px;
    }
    .terms-box ul {
      list-style-type: disc;
      padding-left: 18px;
      line-height: 1.5;
    }
    .terms-box li {
      margin-bottom: 2px;
    }

    /* Footer */
    .receipt-footer {
      border-top: 2px solid #000000;
      margin-top: 18px;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }
    .copyright-text {
      font-weight: 700;
    }
    .signature-text {
      font-weight: 400;
      font-style: italic;
    }

    /* Print Controls */
    .print-actions {
      text-align: center;
      margin-bottom: 20px;
    }
    .btn-print {
      background: #000000;
      color: #ffffff;
      border: 2px solid #000000;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-print:hover {
      background: #ffffff;
      color: #000000;
    }
    @media print {
      .print-actions {
        display: none !important;
      }
      body {
        padding: 0;
      }
      .receipt-container {
        border: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="receipt-container">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">SM*STORE</div>
        <div class="brand-sub">Premium Electronics, Flagship Tech & Audio Gear Pakistan</div>
        <div class="helpline-box">
          <div><strong>WhatsApp Helpline:</strong> +92 300 1234567</div>
          <div><strong>Official Email:</strong> support@smstore.pk</div>
          <div><strong>Online Store:</strong> www.smstore.pk</div>
        </div>
      </div>
      <div class="invoice-tag">
        <div class="invoice-title">Official Receipt</div>
        <div class="invoice-meta"><strong>Invoice #:</strong> INV-${order._id}</div>
        <div class="invoice-meta"><strong>Issue Date:</strong> ${dateStr}</div>
        <div class="invoice-meta"><strong>Order Status:</strong> ${order.orderStatus.toUpperCase()}</div>
      </div>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-grid">
      <div class="meta-block">
        <h4>Customer Information</h4>
        <div class="meta-row"><span class="meta-label">Customer Name:</span><span class="meta-value">${order.customerName}</span></div>
        <div class="meta-row"><span class="meta-label">WhatsApp / Phone:</span><span class="meta-value">${order.customerPhone}</span></div>
        <div class="meta-row"><span class="meta-label">Email Address:</span><span class="meta-value">${order.customerEmail || 'customer@smstore.pk'}</span></div>
      </div>
      <div class="meta-block">
        <h4>Shipping & Payment</h4>
        <div class="meta-row"><span class="meta-label">Payment Method:</span><span class="meta-value">${order.paymentMethod}</span></div>
        <div class="meta-row"><span class="meta-label">Delivery City:</span><span class="meta-value">${order.shippingAddress.city}, Pakistan</span></div>
        <div class="meta-row"><span class="meta-label">Full Address:</span><span class="meta-value">${order.shippingAddress.address}</span></div>
        ${order.shippingAddress.notes ? `<div class="meta-row"><span class="meta-label">Order Notes:</span><span class="meta-value">${order.shippingAddress.notes}</span></div>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 35px;" class="text-center">Sr.</th>
          <th>Product Item & Description</th>
          <th style="width: 50px;" class="text-center">Qty</th>
          <th style="width: 110px;" class="text-right">Unit Price</th>
          <th style="width: 120px;" class="text-right">Total (PKR)</th>
        </tr>
      </thead>
      <tbody>
        ${order.orderItems
          .map(
            (item, index) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-desc">Genuine Product • Serial Verified • Brand Warranty</div>
          </td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">₨ ${new Intl.NumberFormat('en-PK').format(item.price)}</td>
          <td class="text-right"><strong>₨ ${new Intl.NumberFormat('en-PK').format(item.price * item.quantity)}</strong></td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Financial Breakdown -->
    <div class="summary-section">
      <table class="summary-table">
        <tr>
          <td class="sum-label">Items Subtotal:</td>
          <td class="sum-value">₨ ${new Intl.NumberFormat('en-PK').format(itemsTotal)}</td>
        </tr>
        <tr>
          <td class="sum-label">Courier / Shipping Price:</td>
          <td class="sum-value">₨ ${new Intl.NumberFormat('en-PK').format(courierPrice)}</td>
        </tr>
        <tr>
          <td class="sum-label">Sales Tax & Levies:</td>
          <td class="sum-value">₨ ${new Intl.NumberFormat('en-PK').format(tax)}</td>
        </tr>
        <tr class="total-row">
          <td class="sum-label">TOTAL PAYABLE:</td>
          <td class="sum-value">₨ ${new Intl.NumberFormat('en-PK').format(grandTotal)}</td>
        </tr>
      </table>
    </div>

    <!-- Terms & Policies -->
    <div class="terms-box">
      <h5>Terms & Customer Policies:</h5>
      <ul>
        <li><strong>7 Days Checking Warranty:</strong> Valid from delivery date on all electronic products and devices.</li>
        <li><strong>WhatsApp Helpline:</strong> For order updates, courier tracking, or claims, message us on WhatsApp at <strong>+92 300 1234567</strong> with your Invoice ID.</li>
        <li><strong>Rider Verification:</strong> Please inspect package sealed condition before making payment on Cash on Delivery.</li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="receipt-footer">
      <div class="copyright-text">All rights reserved to WebRace Co. 2026 • SM*Store Pakistan</div>
      <div class="signature-text">Computer generated receipt • No physical signature required</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto open print dialog
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
