
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSuccess, handleError } from '../utils'
import { ToastContainer } from 'react-toastify'

function Home() {

  const navigate = useNavigate()
  const [loggedInUser, setLoggedInUser] = useState('')
  const [products, setProducts] = useState('')

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  }, [])

  const handleLogout = (e) => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUser')
    handleSuccess('Logged out successfully')
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }

  const fetchProducts = async () => {
    try {
      const url = 'https://auth-login-signup-api.vercel.app/products';
      const headers =  {
        headers: {
          'Authorization':localStorage.getItem('token')
        }
      }
      const response = await fetch(url,headers);
      const result = await response.json();
      console.log(result);
      setProducts(result)
    } catch (err) {
      handleError(err.message );
      
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  return (
  <div className="home-container">
    <header className="header">
      <h1 className="welcome-text">Welcome {loggedInUser}</h1>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </header>

    <main>
      <table className="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>

    <ToastContainer />
  </div>
);

}

export default Home
