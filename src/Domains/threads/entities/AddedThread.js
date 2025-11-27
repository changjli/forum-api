// filepath: src/Domains/threads/entities/AddedThread.js
class AddedThread {
  constructor(payload) {
    this._checkRequiredFields(payload);
    this._validateDataTypes(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _checkRequiredFields(payload) {
    const requiredFields = ["id", "title", "owner"];
    const hasAllFields = requiredFields.every(
      (field) => payload[field] !== undefined
    );

    if (!hasAllFields) {
      throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _validateDataTypes({ id, title, owner }) {
    const isValidType = [id, title, owner].every(
      (field) => typeof field === "string"
    );

    if (!isValidType) {
      throw new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddedThread;
