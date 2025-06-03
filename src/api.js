const BASE_URL = 'http://localhost:8080';

export async function login(username, password) {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login gagal');
    }
  
    const data = await response.json();
  
    if (data.token) {
      localStorage.setItem('token', data.token);
    } else {
      throw new Error('Token tidak ditemukan');
    }
  }

  export async function searchProducts({ name, min, max }) {
    const token = getToken();
    let url = `${BASE_URL}/api/products/search?`;
    if (name) url += `name=${encodeURIComponent(name)}`;
    else if (min !== undefined && max !== undefined) url += `min=${min}&max=${max}`;
  
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Gagal mencari produk');
    return res.json();
  }
  

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}


export async function fetchProducts() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
  });
  if (!res.ok) throw new Error('Gagal fetch produk');
  return res.json();
}

export async function register(username, password) {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Registrasi gagal';
      throw new Error(message);
    }
  
    return await response.json(); // bisa menyesuaikan jika API kirim token
  }
  

export async function createProduct(product) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
  
    if (!response.ok) {
      // Coba ambil pesan error dari backend
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Gagal menambah produk';
      throw new Error(message);
    }
  
    return await response.json();
  }
  


export async function updateProduct(id, product) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
        // Coba ambil pesan error dari backend
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Gagal update produk';
        throw new Error(message);
      }
  return response.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error('Gagal hapus produk');
  return true;
}
