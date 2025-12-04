const CommentLikeRepository = require("../../Domains/commentLikes/CommentLikeRepository");

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGen = idGenerator;
  }

  async toggleLike({ commentId, userId }) {
    const check = {
      text: "SELECT id FROM comment_likes WHERE comment_id=$1 AND user_id=$2",
      values: [commentId, userId],
    };
    const res = await this._pool.query(check);
    if (res.rowCount) {
      await this._pool.query({
        text: "DELETE FROM comment_likes WHERE comment_id=$1 AND user_id=$2",
        values: [commentId, userId],
      });
      return { liked: false };
    }
    const id = `like-${this._idGen()}`;
    await this._pool.query({
      text: "INSERT INTO comment_likes(id, comment_id, user_id) VALUES($1,$2,$3)",
      values: [id, commentId, userId],
    });
    return { liked: true };
  }

  async getLikeCountsByCommentIds(commentIds) {
    if (!commentIds.length) return {};
    const q = {
      text: "SELECT comment_id, COUNT(*)::int AS count FROM comment_likes WHERE comment_id = ANY($1::text[]) GROUP BY comment_id",
      values: [commentIds],
    };
    const { rows } = await this._pool.query(q);
    return rows.reduce((acc, r) => {
      acc[r.comment_id] = r.count;
      return acc;
    }, {});
  }
}

module.exports = CommentLikeRepositoryPostgres;
