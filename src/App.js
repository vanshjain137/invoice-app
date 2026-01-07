import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './component/login/Login';
import Register from './component/register/Register';
import Dashboard from './component/dashboard/Dashboard';
import Home from './component/dashboard/Home';
import Invoices from './component/dashboard/Invoices';
import NewInvoice from './component/dashboard/NewInvoice';
import Setting from './component/dashboard/Setting';
import InvoiceDetail from './component/dashboard/InvoiceDetail';


function App() {
  const myRouter = createBrowserRouter([
    {path:'',element:<Login/>},
    {path:'/login',element:<Login/>},
    {path:'/register',element:<Register/>},
    {path:'/dashboard',element:<Dashboard/>,children:[
      {path:'',element:<Home/>},
      {path:'home',element:<Home/>},
      {path:'invoices',element:<Invoices/>},
      {path:'new-invoice',element:<NewInvoice/>},
      {path:'setting',element:<Setting/>},
      {path:'invoice-detail',element:<InvoiceDetail/>}
    ]}
  ])
  return (
    <div>
      <RouterProvider router={myRouter}></RouterProvider>
    </div>
  );
}

export default App;
