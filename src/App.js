import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import {
  getToken,
  logout,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search states
  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError('');
    } catch (e) {
      setError('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  // Search products berdasarkan filter
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      // Jika ada nama, search by name
      if (searchName) {
        const data = await searchProducts({ name: searchName });
        setProducts(data);
      }
      // Jika ada harga min & max, search by price range
      else if (minPrice && maxPrice) {
        const data = await searchProducts({ min: minPrice, max: maxPrice });
        setProducts(data);
      } else {
        // Jika kosong, load semua produk
        await loadProducts();
      }
    } catch (e) {
      setError('Gagal mencari produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setProducts([]);
  };

  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await updateProduct(product.id, product);
      } else {
        await createProduct(product);
      }
      setEditingProduct(null);
      await loadProducts();
    } catch {
      setError('Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      setError('Gagal menghapus produk');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Manajemen Produk</h1>
      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSearch} style={{ marginTop: 20, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Cari nama produk"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ marginRight: 10 }}
          disabled={minPrice !== '' || maxPrice !== ''}
        />
        <input
          type="number"
          placeholder="Harga min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: 10, width: 100 }}
          disabled={searchName !== ''}
        />
        <input
          type="number"
          placeholder="Harga max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginRight: 10, width: 100 }}
          disabled={searchName !== ''}
        />
        <button type="submit">Cari</button>
        <button
          type="button"
          onClick={() => {
            setSearchName('');
            setMinPrice('');
            setMaxPrice('');
            loadProducts();
          }}
          style={{ marginLeft: 10 }}
        >
          Reset
        </button>
      </form>

      <button onClick={() => setEditingProduct({})} style={{ marginBottom: 20 }}>
        Tambah Produk
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductList products={products} onEdit={setEditingProduct} onDelete={handleDeleteProduct} />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct.id ? editingProduct : null}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}

export default App;
