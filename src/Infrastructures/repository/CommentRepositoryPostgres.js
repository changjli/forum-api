const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGen = idGenerator;
  }

  async addComment(addCommentEntity) {
    const id = `comment-${this._idGen()}`;
    const { content, threadId, owner } = addCommentEntity;
    const query = {
      text: "INSERT INTO comments(id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, threadId, content, owner],
    };
    const { rows } = await this._pool.query(query);
    return new AddedComment(rows[0]);
  }

  async verifyCommentExistence(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError("komentar tidak ditemukan");
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError("komentar tidak ditemukan");
    if (rows[0].owner !== owner)
      throw new AuthorizationError("anda tidak berhak menghapus komentar ini");
  }

  async softDeleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = TRUE WHERE id = $1",
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async findCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
             FROM comments c
             JOIN users u ON u.id = c.owner
             WHERE c.thread_id = $1
             ORDER BY c.date ASC`,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
