const pool = require('../models/db');
const Joi = require('joi');

class Task {
    constructor() {}

    async find(id) {
        await this.idValidation(id)
        const response = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        return response?.rows?.[0]
    }

    async findAll(data) {
        const params = await Joi.object({
            page: Joi.number(),
            perPage: Joi.number(),
        }).validateAsync(data)

        let query = "SELECT * FROM tarefas t"

        if (params.page > 0) query += ` OFFSET ${(params.page - 1) * (params.perPage || 10)}`
        if (params.perPage) query += ` LIMIT ${params.perPage}`

        const { rows: [total] } = await pool.query("SELECT count(1) as value FROM tarefas t") || { rows: [] };
        const { rows: content } = await pool.query(query) || { rows: [] };

        return { content, total: Number(total?.value || 0) }
    }

    async create(data) {
        const body = await Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            date: Joi.string().isoDate().required(),
            status: Joi.string().required(),
            priority: Joi.string().required(),
            idColumn: Joi.number(),
            idUser: Joi.number()
        }).validateAsync(data)

        await pool.query(`
            INSERT INTO tarefas (titulo, descricao, data_criacao, data_vencimento, situacao, prioridade, coluna_id, usuario_id)
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7)
        `, [body.title, body.description, body.date, body.status, body.priority, body.idColumn, body.idUser])

        return { status: 201, message: "Tarefa criada com sucesso!" }
    }

    async update(id, data) {
        await this.idValidation(id)

        const body = await Joi.object({
            title: Joi.string(),
            description: Joi.string(),
            date: Joi.string().isoDate(),
            status: Joi.string(),
            priority: Joi.string(),
            idColumn: Joi.number(),
            idUser: Joi.number()
        }).validateAsync(data)

        const task = await this.find(id)

        if (!task) throw { status: 404, message: "Tarefa não foi encontrada para ser atualizada!" }

        await pool.query(`
            UPDATE tarefas SET
                titulo = $2, 
                descricao = $3,
                data_vencimento = $4, 
                situacao = $5,
                prioridade = $6,
                coluna_id = $7
            WHERE id = $1
        `, [id, body.title, body.description, body.date, body.status, body.priority, body.idColumn])

        return { status: 200, message: "Tarefa atualizada com sucesso!" }
    }

    async delete(id) {
        await this.idValidation(id)
            
        await pool.query('DELETE FROM tarefas WHERE id = $1', [id])

        return { status: 200, message: "Tarefa deletada com sucesso!" }
    }

    async idValidation(id) {
        if (isNaN(Number(id))) throw { status: 400, message: "ID precisa ser do tipo inteiro!" }

        if (!!id) return id

        throw { status: 404, message: "ID da tarefa não foi informado!" }
    }
}

module.exports = Task