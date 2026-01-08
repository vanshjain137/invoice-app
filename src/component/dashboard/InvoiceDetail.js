import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const InvoiceDetail = () => {
    const location = useLocation()
    const [data, setData] = useState(location.state)

    const printInvoice = () => {
        const input = document.getElementById('invoice')
        html2canvas(input, { useCORS: true })
            .then((canvas) => {
                const imageData = canvas.toDataURL('image/png', 1.0)
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [612, 792]
                })
                pdf.internal.scaleFactor = 1
                const imageProps = pdf.getImageProperties(imageData)
                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width

                pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                pdf.save('invoice_' + new Date().toISOString().slice(0, 10) + '.pdf')
            })
    }

    return (
    <div>
        <div className='invoice-top-header'>
            <button onClick={printInvoice} className='print-btn'>
                <i className="fa-solid fa-print"></i> Print Invoice
            </button>
        </div>
        <div id='invoice' className='invoice-wrapper'>
            <div className='invoice-header'>
                <div className='company-brand'>
                    <img className='company-logo' src={localStorage.getItem('photoURL')} alt="logo" />
                    <h2>{localStorage.getItem('cName')}</h2>
                </div>
                <div className='invoice-meta'>
                    <h1>INVOICE</h1>
                    <p>Invoice #: {data.id ? data.id.slice(0, 8).toUpperCase() : 'INV-001'}</p>
                    <p>Date: {new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                </div>
            </div>

            <hr className='divider' />

            <div className='billing-section'>
                <div className='bill-to'>
                    <p className='label'>BILL TO:</p>
                    <h3>{data.to}</h3>
                    <p>{data.address}</p>
                    <p>Phone: {data.phone}</p>
                </div>
            </div>

            <table className='product-table'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Item Description</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.product.map((product, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>₹{Number(product.price).toLocaleString('en-IN')}</td>
                            <td>{product.qty}</td>
                            <td>₹{(product.price * product.qty).toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='invoice-footer-total'>
                <div className='empty-space'></div>
                <div className='total-calculations'>
                    <div className='calc-row'>
                        <span>Subtotal</span>
                        <span>₹{Number(data.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    {data.tax > 0 && (
                        <div className='calc-row'>
                            <span>Tax ({data.taxPercentage}%)</span>
                            <span>₹{Number(data.tax).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className='calc-row grand-total-row'>
                        <span>Grand Total</span>
                        <span>₹{Number(data.total).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
            
            <div className='invoice-note'>
                <p>Thank you for your business!</p>
            </div>
        </div>
    </div>
)
}

export default InvoiceDetail
