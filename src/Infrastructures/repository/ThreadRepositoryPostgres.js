const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGen = idGenerator;
  }

  async addThread(addThreadEntity) {
    const id = `thread-${this._idGen()}`;
    const { title, body, owner } = addThreadEntity;
    const query = {
      text: "INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };
    const { rows } = await this._pool.query(query);
    return new AddedThread(rows[0]);
  }

  async checkThreadExistence(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError("thread tidak ditemukan");
  }

  async findThreadById(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
             FROM threads t
             JOIN users u ON u.id = t.owner
             WHERE t.id = $1`,
      values: [threadId],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError("thread tidak ditemukan");
    return rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
