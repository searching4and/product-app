import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
    }
  }, [product]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !price) {
      setError('Nama dan harga wajib diisi');
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      setError('Harga harus angka dan lebih dari 0');
      return;
    }
    setError('');
    onSave({
      ...product,
      name,
      description,
      price: Number(price),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
      <h3>{product ? 'Edit Produk' : 'Tambah Produk'}</h3>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Nama produk"
          value={name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={e => setPrice(e.target.value)} />
      </div>
      <button type="submit">{product ? 'Update' : 'Tambah'}</button>
      <button type="button" onClick={onCancel} style={{marginLeft: '10px'}}>Batal</button>
    </form>
  );
}
