import { Chart } from 'chart.js/auto'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [total, setTotal] = useState(0)
  const [totalInvoice, setTotalInvoice] = useState(1423)
  const [totalMonthCollection, setTotalMonthCollection] = useState(34563)
  const [invoices, setInvoices] = useState([])

  const navigate = useNavigate()

  const chartRef = useRef(null);

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const q = query(collection(db, "invoices"), where('uid', "==", localStorage.getItem('uid')), orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setInvoices(data)
    getOverAllTotal(data)
    getMonthsTotal(data)
    monthWiseCollection(data)
  }

  const getOverAllTotal = (invoiceList) => {
    var t = 0;
    invoiceList.forEach(data => {
      t += data.total
    })
    setTotal(t)
  }

  const getMonthsTotal = (invoiceList) => {
    var mt = 0;
    invoiceList.forEach(data => {
      if (new Date(data.date.seconds * 1000).getMonth() == new Date().getMonth()) {
        mt += data.total
      }
    })
    setTotalMonthCollection(mt)
  }

  const monthWiseCollection = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }

    data.forEach(d => {
      if (new Date(d.date.seconds * 1000).getFullYear() == new Date().getFullYear()) {
        chartData[new Date(d.date.seconds * 1000).toLocaleDateString('default', { month: 'long' })] += d.total
      }
    })
    createChart(chartData)
  }

  const createChart = (chartData) => {
    const ctx = document.getElementById('myChart');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Month wise Collection',
          data: Object.values(chartData),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '₹' + value.toLocaleString('en-IN');
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return 'Collection: ₹' + context.parsed.y.toLocaleString('en-IN');
              }
            }
          }
        }
      }
    });
  }
  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1'>
          <h1 className='box-header'>Rs. {Number(total).toLocaleString('en-IN')}</h1>
          <p className='box-title'>Overall</p>
        </div>

        <div className='home-box box-2'>
          <h1 className='box-header'>{invoices.length}</h1>
          <p className='box-title'>Invoices</p>
        </div>

        <div className='home-box box-3'>
          <h1 className='box-header'>Rs. {Number(totalMonthCollection).toLocaleString('en-IN')}</h1>
          <p className='box-title'>This Month</p>
        </div>
      </div>

      <div className='home-second-row'>
        <div className='chart-box'>
          <canvas id="myChart"></canvas>
        </div>

        <div className='recent-invoice-list'>
          <h1>Recent Invoice List</h1>
          <div>
            <p style={{ fontWeight: 'bold' }}>Customer Name</p>
            <p style={{ fontWeight: 'bold' }}>Date</p>
            <p style={{ fontWeight: 'bold' }}>Total</p>
          </div>
          {
            invoices.slice(0, 6).map(data => (
              <div key={data.id} className='recent-invoice-list-items' onClick={() => { navigate('/dashboard/invoice-detail', { state: data }) }}>
                <p>{data.to}</p>
                <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                <p>₹{Number(data.total).toLocaleString('en-IN')}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home
