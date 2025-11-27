class AddComment {
  constructor(payload) {
    this._assertRequired(payload);
    this._assertTypes(payload);

    this.content = payload.content;
    this.threadId = payload.threadId;
    this.owner = payload.owner;
  }

  _assertRequired(p) {
    const needed = ["content", "threadId", "owner"];
    if (!needed.every((k) => p[k] !== undefined)) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _assertTypes({ content, threadId, owner }) {
    if (![content, threadId, owner].every((v) => typeof v === "string")) {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddComment;
