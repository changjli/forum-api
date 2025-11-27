class AddedReply {
  constructor(payload) {
    this._assertRequired(payload);
    this._assertTypes(payload);
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _assertRequired(p) {
    const needed = ["id", "content", "owner"];
    if (!needed.every((k) => p[k] !== undefined)) {
      throw new Error("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _assertTypes({ id, content, owner }) {
    if (![id, content, owner].every((v) => typeof v === "string")) {
      throw new Error("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddedReply;
