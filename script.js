document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('invoiceForm');
    const invoiceDiv = document.getElementById('invoice');
    const invoiceItemsTable = document.getElementById('invoiceItems');
    let itemCount = 0;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });

    window.addItem = function () {
        itemCount++;
        const tbody = document.getElementById('items');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${itemCount}</td>
            <td><input type="text" name="description" required></td>
            <td><input type="number" name="quantity" oninput="updateTotal(this)" required></td>
            <td><input type="number" name="unitPrice" oninput="updateTotal(this)" required></td>
            <td class="total">0.00</td>
        `;

        tbody.appendChild(row);
    }

    window.updateTotal = function (element) {
        const row = element.closest('tr');
        const quantity = parseFloat(row.querySelector('input[name="quantity"]').value) || 0;
        const unitPrice = parseFloat(row.querySelector('input[name="unitPrice"]').value) || 0;
        const total = row.querySelector('.total');

        total.textContent = (quantity * unitPrice).toFixed(2);
        calculateNetTotal();
    }

    function calculateNetTotal() {
        const totals = document.querySelectorAll('.total');
        let netTotal = 0;

        totals.forEach(total => {
            netTotal += parseFloat(total.textContent) || 0;
        });

        document.getElementById('netTotal').textContent = netTotal.toFixed(2);

        const gst = netTotal * 0.18; // Assuming GST is 18%
        document.getElementById('gstAmount').textContent = gst.toFixed(2);
        const totalAmount = netTotal + gst;
        document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

        // Convert total amount to words
        // document.getElementById('totalAmountWords').textContent = `Total in words: ${numberToWords(totalAmount)} Only`;
    }

    window.generateInvoice = function () {
        const billerName = document.getElementById('billerName').value;
        const billerAddress = document.getElementById('billerAddress').value;
        const billerPhone = document.getElementById('billerPhone').value;
        const billerEmail = document.getElementById('billerEmail').value;

        document.getElementById('billName').textContent = billerName;
        document.getElementById('billAddress').textContent = billerAddress;
        document.getElementById('billPhone').textContent = billerPhone;
        document.getElementById('billEmail').textContent = billerEmail;

        // Hide the form and show the invoice
        const ele = document.getElementsByClassName('container');
        ele[0].classList.add('hidden');
        form.style.display = 'none';
        invoiceDiv.classList.remove('hidden');
        invoiceDiv.style.display = 'block';

        // Generate other invoice details
        const invoiceNo = 'INV-' + Math.floor(Math.random() * 1000000);
        const invoiceDate = new Date().toLocaleDateString();

        document.getElementById('invoiceNo').textContent = invoiceNo;
        document.getElementById('invoiceDate').textContent = invoiceDate;

        // Copy item details to invoice
        const itemsTable = document.getElementById('items');
        invoiceItemsTable.innerHTML = ''; // Clear previous items

        itemsTable.querySelectorAll('tr').forEach(tr => {
            const clonedRow = tr.cloneNode(true);
            clonedRow.querySelectorAll('input').forEach(input => {
                const span = document.createElement('span');
                span.textContent = input.value;
                input.parentNode.replaceChild(span, input);
            });
            invoiceItemsTable.appendChild(clonedRow);
        });

        // Calculate totals for the invoice
        calculateNetTotal();
    }

    // function numberToWords(num) {
    //     const a = [
    //         '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    //         'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    //     ];
    //     const b = [
    //         '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    //     ];
    //     const g = [
    //         '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion',
    //         'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion',
    //         'quindecillion', 'sexdecillion', 'septendecillion', 'octodecillion', 'novemdecillion', 'vigintillion'
    //     ];
    
    //     const makeGroup = ([ones, tens, huns]) => {
    //         return [
    //             num => a[ones] || '',
    //             num => b[tens] || '',
    //             num => (num > 0 ? a[huns] + ' hundred' : '')
    //         ];
    //     };
    
    //     const thousand = (group, i) => group === '' ? group : `${group} ${g[i]}`;
    
    //     if (typeof num === 'number')
    //         return num === 0 ? 'zero' : convertToWords(String(num));
    //     else if (typeof num === 'string')
    //         return num === '0' ? 'zero' : convertToWords(num);
    //     else return '';
    
    //     function convertToWords(str) {
    //         let start = str.length;
    //         const chunks = [];
    //         while (start > 0) {
    //             const end = start;
    //             chunks.push(str.slice((start = Math.max(0, start - 3)), end));
    //         }
    //         return chunks
    //             .map((chunk, i) => thousand(makeGroup(chunk.split('').reverse())(chunk), i))
    //             .filter(chunk => chunk)
    //             .reverse()
    //             .join(' ');
    //     }
    // }

    window.printInvoice = function () {
        window.print();
    }

    window.downloadPDF = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.html(document.getElementById('invoice'), {
            callback: function (doc) {
                doc.save('invoice.pdf');
            },
            x: 10,
            y: 10
        });
    }
});
