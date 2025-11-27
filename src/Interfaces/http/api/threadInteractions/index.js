const ThreadInteractionsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "thread-interactions",
  register: async (server, { container }) => {
    const handler = new ThreadInteractionsHandler(container);
    server.route(routes(handler));
  },
};
