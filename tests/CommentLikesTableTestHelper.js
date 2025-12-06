/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addLike({ id = "like-123", commentId, userId, date = new Date() }) {
    const query = {
      text: "INSERT INTO comment_likes(id, comment_id, user_id, date) VALUES($1,$2,$3,$4)",
      values: [id, commentId, userId, date],
    };
    await pool.query(query);
  },
  async findLike(commentId, userId) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE comment_id=$1 AND user_id=$2",
      values: [commentId, userId],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async countByCommentId(commentId) {
    const query = {
      text: "SELECT COUNT(*)::int AS count FROM comment_likes WHERE comment_id=$1",
      values: [commentId],
    };
    const result = await pool.query(query);
    return result.rows[0].count;
  },
  async cleanTable() {
    await pool.query("DELETE FROM comment_likes");
  },
};

module.exports = CommentLikesTableTestHelper;
