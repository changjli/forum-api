class AddReply {
  constructor(payload) {
    this._assertRequired(payload);
    this._assertTypes(payload);
    this.content = payload.content;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  _assertRequired(p) {
    const needed = ["content", "commentId", "owner", "threadId"];
    if (!needed.every((k) => p[k] !== undefined)) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _assertTypes({ content, commentId, owner, threadId }) {
    if (
      ![content, commentId, owner, threadId].every((v) => typeof v === "string")
    ) {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReply;
