import { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';
import { ToastContainer } from 'react-toastify';

// Import icons
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null means add mode

  // Form state for modal
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    image: null,
  });

  // Helper function to try fetch with fallback
  const fetchWithFallback = async (primaryUrl, fallbackUrl, options = {}) => {
    try {
      let res = await fetch(primaryUrl, options);
      if (!res.ok) throw new Error(`Primary API error: ${res.status}`);
      return res;
    } catch (err) {
      console.warn('Primary API failed, trying fallback...', err.message);
      let res = await fetch(fallbackUrl, options);
      if (!res.ok) throw new Error(`Fallback API error: ${res.status}`);
      return res;
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const primaryUrl = 'https://auth-login-signup-api.vercel.app/products/getall';
      const fallbackUrl = 'http://localhost:8080/products/getall';
      const headers = {
        Authorization: localStorage.getItem('token'),
      };

      const response = await fetchWithFallback(primaryUrl, fallbackUrl, { headers });
      const result = await response.json();

      setProducts(result.products || []);
    } catch (err) {
      handleError(err.message);
    }
  }, []);

    useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
    fetchProducts();
  }, [fetchProducts]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully');
    setTimeout(() => navigate('/login'), 1000);
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditProduct(null);
    setFormData({ name: '', quantity: '', price: '', image: null });
    setModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      image: null, // Reset image upload (optional)
    });
    setModalOpen(true);
  };

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit add/edit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.price) {
      handleError('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editProduct ? 'PUT' : 'POST';

      // Use correct URLs
      const primaryUrl = editProduct
        ? `https://auth-login-signup-api.vercel.app/products/update/${editProduct._id}`
        : 'https://auth-login-signup-api.vercel.app/products/create';
      const fallbackUrl = editProduct
        ? `http://localhost:8080/products/update/${editProduct._id}`
        : 'http://localhost:8080/products/create';

      // Prepare form data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('quantity', formData.quantity);
      data.append('price', formData.price);
      if (formData.image) data.append('image', formData.image);

      const response = await fetchWithFallback(primaryUrl, fallbackUrl, {
        method,
        headers: {
          Authorization: token,
          // Do NOT set 'Content-Type' with FormData; browser sets it automatically
        },
        body: data,
      });

      if (!response.ok) throw new Error('Failed to save product');

      handleSuccess(editProduct ? 'Product updated' : 'Product added');
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      handleError(err.message);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');

      const primaryUrl = `https://auth-login-signup-api.vercel.app/products/delete/${productId}`;
      const fallbackUrl = `http://localhost:8080/products/delete/${productId}`;

      const response = await fetchWithFallback(primaryUrl, fallbackUrl, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');

      handleSuccess('Product deleted');
      fetchProducts();
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="welcome-text">Welcome, {loggedInUser}</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <div className="table-header">
          <h2>Products</h2>
          <button className="add-product-btn" onClick={openAddModal}>
            <FaPlus /> Add Product
          </button>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th style={{ width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No products found</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td className="action-cell">
                    <button 
                      className="btn-icon edit-btn" 
                      onClick={() => openEditModal(product)} 
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-icon delete-btn" 
                      onClick={() => handleDelete(product._id)} 
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <label>
                Name*:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Quantity*:
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </label>

              <label>
                Price*:
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                />
              </label>

              <label>
                Image:
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn-submit">
                  {editProduct ? 'Update' : 'Add'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
