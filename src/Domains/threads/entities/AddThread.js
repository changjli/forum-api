class AddThread {
  constructor(payload) {
    this._checkRequiredFields(payload);
    this._validateDataTypes(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  _checkRequiredFields(payload) {
    const requiredFields = ["title", "body"];
    const hasAllFields = requiredFields.every(
      (field) => payload[field] !== undefined
    );

    if (!hasAllFields) {
      throw new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _validateDataTypes({ title, body }) {
    const isValidType = [title, body].every(
      (field) => typeof field === "string"
    );

    if (!isValidType) {
      throw new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddThread;
