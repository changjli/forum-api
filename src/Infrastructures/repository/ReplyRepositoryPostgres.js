const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGen = idGenerator;
  }

  async addReply(addReplyEntity) {
    const id = `reply-${this._idGen()}`;
    const { content, commentId, owner } = addReplyEntity;
    const query = {
      text: "INSERT INTO replies(id, comment_id, content, owner) VALUES($1,$2,$3,$4) RETURNING id, content, owner",
      values: [id, commentId, content, owner],
    };
    const { rows } = await this._pool.query(query);
    return new AddedReply(rows[0]);
  }

  async verifyReplyExistence(replyId) {
    const q = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [replyId],
    };
    const { rowCount } = await this._pool.query(q);
    if (!rowCount) throw new NotFoundError("balasan tidak ditemukan");
  }

  async verifyReplyOwner(replyId, owner) {
    const q = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };
    const { rows, rowCount } = await this._pool.query(q);
    if (!rowCount) throw new NotFoundError("balasan tidak ditemukan");
    if (rows[0].owner !== owner)
      throw new AuthorizationError("anda tidak berhak menghapus balasan ini");
  }

  async softDeleteReply(replyId) {
    const q = {
      text: "UPDATE replies SET is_delete = TRUE WHERE id = $1",
      values: [replyId],
    };
    await this._pool.query(q);
  }

  async findRepliesByCommentIds(commentIds) {
    if (!commentIds.length) return [];
    const query = {
      text: `SELECT r.id, r.comment_id, u.username, r.date, r.content, r.is_delete
             FROM replies r
             JOIN users u ON u.id = r.owner
             WHERE r.comment_id = ANY($1::text[])
             ORDER BY r.date ASC`,
      values: [commentIds],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
