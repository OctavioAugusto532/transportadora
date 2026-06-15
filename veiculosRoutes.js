const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. DESTACADO: Buscar frota completa com motoristas associados (Para o Menu/Dashboard)
// Usa LEFT JOIN para listar todos os veículos e o nome do motorista, se houver.
router.get('/frota-status', async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id AS veiculo_id,
                v.modelo,
                v.placa,
                v.status AS veiculo_status,
                m.id AS motorista_id,
                m.nome AS motorista_nome
            FROM veiculos v
            LEFT JOIN motoristas m ON v.motorista_id = m.id
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o status da frota.', detalhe: error.message });
    }
});

// 2. CREATE: Adicionar novo veículo
router.post('/veiculos', async (req, res) => {
    const { modelo, placa, status, motorista_id } = req.body;
    try {
        const query = 'INSERT INTO veiculos (modelo, placa, status, motorista_id) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [modelo, placa, status || 'Disponível', motorista_id || null]);
        res.status(201).json({ message: 'Veículo cadastrado com sucesso!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar veículo.', detalhe: error.message });
    }
});

// 3. READ: Listar todos os veículos (simples)
router.get('/veiculos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM veiculos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículos.' });
    }
});

// 4. UPDATE: Atualizar dados do veículo / Associar ou alterar Motorista
router.put('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    const { modelo, placa, status, motorista_id } = req.body;
    try {
        const query = 'UPDATE veiculos SET modelo = ?, placa = ?, status = ?, motorista_id = ? WHERE id = ?';
        await db.query(query, [modelo, placa, status, motorista_id || null, id]);
        res.json({ message: 'Veículo atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar veículo.', detalhe: error.message });
    }
});

// 5. DELETE: Remover veículo da frota
router.delete('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM veiculos WHERE id = ?', [id]);
        res.json({ message: 'Veículo removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover veículo.' });
    }
});

module.exports = router;