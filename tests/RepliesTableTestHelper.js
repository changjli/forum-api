const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    commentId = "comment-123",
    content = "balasan",
    owner = "user-123",
    date = new Date(),
    isDelete = false,
  }) {
    const query = {
      text: "INSERT INTO replies(id,comment_id,content,owner,date,is_delete) VALUES($1,$2,$3,$4,$5,$6)",
      values: [id, commentId, content, owner, date, isDelete],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies");
  },
};

module.exports = RepliesTableTestHelper;
