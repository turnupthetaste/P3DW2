import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'; // importe seu CSS com as variáveis do tema

const API_URL = 'http://localhost:3000/api/reservas';

function App() {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({
    nomeCliente: '',
    numeroMesa: '',
    dataHora: '',
    status: 'reservado',
    contato: ''
  });
  const [editId, setEditId] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // Buscar reservas do backend
  const fetchReservas = async () => {
    try {
      const res = await axios.get(API_URL);
      setReservas(res.data);
    } catch (error) {
      console.error('Erro ao buscar reservas', error);
    }
  };

  // Alternar tema e aplicar/remover classe no body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ nomeCliente: '', numeroMesa: '', dataHora: '', status: 'reservado', contato: '' });
      setEditId(null);
      fetchReservas();
    } catch (error) {
      console.error('Erro ao salvar reserva', error);
    }
  };

  const handleEdit = (reserva) => {
    setForm({
      nomeCliente: reserva.nomeCliente,
      numeroMesa: reserva.numeroMesa,
      dataHora: reserva.dataHora.slice(0, 16),
      status: reserva.status,
      contato: reserva.contato
    });
    setEditId(reserva._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchReservas();
    } catch (error) {
      console.error('Erro ao excluir reserva', error);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="container">
      <h1>Sistema de Reservas</h1>

      <button
        onClick={toggleTheme}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          background: 'var(--primary)',
          color: 'var(--primary-foreground)'
        }}
      >
        {isDark ? 'Modo Claro' : 'Modo Escuro'}
      </button>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="nomeCliente"
          placeholder="Nome do Cliente"
          value={form.nomeCliente}
          onChange={handleChange}
          required
        />
        <input
          name="numeroMesa"
          type="number"
          placeholder="Número da Mesa"
          value={form.numeroMesa}
          onChange={handleChange}
          required
          min="1"
        />
        <input
          name="dataHora"
          type="datetime-local"
          value={form.dataHora}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="reservado">Reservado</option>
          <option value="ocupado">Ocupado</option>
          <option value="disponível">Disponível</option>
        </select>
        <input
          name="contato"
          placeholder="Contato"
          value={form.contato}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Atualizar' : 'Criar'} Reserva</button>
      </form>

      <ul className="lista">
        {reservas.map((res) => (
          <li key={res._id}>
            <strong>{res.nomeCliente}</strong> | Mesa {res.numeroMesa} |{' '}
            {new Date(res.dataHora).toLocaleString()} | {res.status}
            <div>
              <button onClick={() => handleEdit(res)}>Editar</button>
              <button onClick={() => handleDelete(res._id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
