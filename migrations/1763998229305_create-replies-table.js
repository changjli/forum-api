/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: { type: "varchar(50)", primaryKey: true },
    comment_id: { type: "varchar(50)", notNull: true },
    content: { type: "text", notNull: true },
    owner: { type: "varchar(50)", notNull: true },
    date: { type: "timestamp", notNull: true, default: pgm.func("NOW()") },
    is_delete: { type: "boolean", notNull: true, default: false },
  });

  pgm.addConstraint("replies", "fk_replies_comment_id_comments", {
    foreignKeys: {
      columns: "comment_id",
      references: "comments(id)",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("replies", "fk_replies_owner_users", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "cascade",
    },
  });

  pgm.createIndex("replies", "comment_id");
};

exports.down = (pgm) => {
  pgm.dropTable("replies");
};
