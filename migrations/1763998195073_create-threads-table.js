/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: { type: "varchar(50)", primaryKey: true },
    title: { type: "text", notNull: true },
    body: { type: "text", notNull: true },
    owner: { type: "varchar(50)", notNull: true },
    date: { type: "timestamp", notNull: true, default: pgm.func("NOW()") },
  });

  pgm.addConstraint("threads", "fk_threads_owner_users", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "cascade",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
