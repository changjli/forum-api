/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: { type: "varchar(50)", primaryKey: true },
    thread_id: { type: "varchar(50)", notNull: true },
    content: { type: "text", notNull: true },
    owner: { type: "varchar(50)", notNull: true },
    date: { type: "timestamp", notNull: true, default: pgm.func("NOW()") },
    is_delete: { type: "boolean", notNull: true, default: false },
  });

  pgm.addConstraint("comments", "fk_comments_thread_id_threads", {
    foreignKeys: {
      columns: "thread_id",
      references: "threads(id)",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("comments", "fk_comments_owner_users", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "cascade",
    },
  });

  pgm.createIndex("comments", "thread_id");
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
