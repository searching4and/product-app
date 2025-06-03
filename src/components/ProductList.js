import React from 'react';

export default function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) return <p>Tidak ada produk</p>;

  return (
    <table border="1" cellPadding="5" style={{width:'100%', marginTop: '20px'}}>
      <thead>
        <tr>
          <th>ID</th><th>Nama</th><th>Deskripsi</th><th>Harga</th><th>Tanggal dibuat</th><th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>{p.price}</td>
            <td>{new Date(p.createdAt).toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(p)}>Edit</button>
              <button onClick={() => onDelete(p.id)}>Hapus</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
