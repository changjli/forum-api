const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    threadId = "thread-123",
    content = "konten",
    owner = "user-123",
    date = new Date(),
    isDelete = false,
  }) {
    const query = {
      text: "INSERT INTO comments(id,thread_id,content,owner,date,is_delete) VALUES($1,$2,$3,$4,$5,$6)",
      values: [id, threadId, content, owner, date, isDelete],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments");
  },
};

module.exports = CommentsTableTestHelper;
