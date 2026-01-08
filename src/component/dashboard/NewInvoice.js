import React, { useState } from 'react'
import { db } from '../../firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const NewInvoice = () => {
    const [to, setTo] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState(1)
    const [taxInput, setTaxInput] = useState(0)
    const [taxAmount, setTaxAmount] = useState(0)
    const [isLoading, setLoading] = useState(false)

    const [product, setProduct] = useState([])

    const navigate = useNavigate()

    const subtotal = product.reduce((acc, curr) => acc + (curr.price * curr.qty), 0)

    const total = subtotal + taxAmount

    const addProduct = () => {
        setProduct([...product, { 'id': product.length, 'name': name, 'price': Number(price), 'qty': Number(qty) }])
        setName('')
        setPrice('')
        setQty(1)
    }

    const handleCalculateTax = () => {
        const calculatedTax = (subtotal * Number(taxInput)) / 100
        setTaxAmount(calculatedTax)
    }

    const saveData = async () => {
        if (product.length === 0) {
            alert("Please add at least one product");
            return;
        }

        setLoading(true);

        // Create the object first to keep code clean
        const finalData = {
            to: to,
            phone: phone,
            address: address,
            product: product,
            total: total,
            subtotal: subtotal,
            tax: taxAmount,
            taxPercentage: taxInput,
            uid: localStorage.getItem('uid'),
            date: Timestamp.fromDate(new Date())
        };

        try {
            // Use 'docRef' to match your navigate logic
            const docRef = await addDoc(collection(db, 'invoices'), finalData);

            // Pass the finalData AND the new ID to the next page
            navigate('/dashboard/invoice-detail', {
                state: { ...finalData, id: docRef.id }
            });
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("Failed to save invoice");
        }

        setLoading(false);
    }
    return (
        <div>
            <div className='header-row'>
                <p className='new-invoice-heading'>New Invoice</p>
                <button onClick={saveData} className='add-btn' type='button'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Save Data</button>
            </div>
            <form className='new-invoice-form'>
                <div className='first-row'>
                    <input onChange={e => { setTo(e.target.value) }} placeholder='To' value={to} />
                    <input onChange={e => { setPhone(e.target.value) }} placeholder='Phone' value={phone} />
                    <input onChange={e => { setAddress(e.target.value) }} placeholder='Address' value={address} />
                </div>

                <div className='first-row'>
                    <input onChange={e => { setName(e.target.value) }} placeholder='Product Name' value={name} />
                    <input type='number' onChange={e => { setPrice(e.target.value) }} placeholder='Price' value={price} />
                    <input onChange={e => { setQty(e.target.value) }} type='number' placeholder='Quantity' value={qty} />
                </div>
                <button onClick={addProduct} className='add-btn' type='button'>Add Product</button>
            </form>

            {product.length > 0 && <div className='product-wrapper'>
                <div className='product-list'>
                    <p>S. No</p>
                    <p>Product Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total Price</p>
                </div>
                {
                    product.map((data, index) => (
                        <div className='product-list' key={index}>
                            <p>{index + 1}</p>
                            <p>{data.name}</p>
                            <p>{data.price.toLocaleString('en-IN')}</p>
                            <p>{data.qty}</p>
                            <p>{(data.price * data.qty).toLocaleString('en-IN')}</p>
                        </div>
                    ))
                }

                <div className='new-invoice-total-wrapper'>
                    <div className='tax-input-section'>
                        <p className='label'>APPLY TAX</p>
                        <div className='tax-control-group'>
                            <input
                                type="number"
                                step="any"
                                placeholder="Tax %"
                                value={taxInput}
                                onChange={(e) => setTaxInput(e.target.value)}
                                className='modern-tax-input'
                            />
                            <button onClick={handleCalculateTax} className='modern-tax-btn' type='button'>
                                Calculate
                            </button>
                        </div>
                    </div>

                    <div className='final-calculations'>
                        <div className='calc-line'>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {taxAmount > 0 && (
                            <div className='calc-line tax-line'>
                                <span>Tax ({taxInput}%)</span>
                                <span>+ ₹{taxAmount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className='calc-line grand-total-line'>
                            <span>Grand Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default NewInvoice
