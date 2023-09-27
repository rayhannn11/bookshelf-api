const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  // Create server
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Connect routes and start
  server.route(routes);
  await server.start();
  console.log(`Server running pada ${server.info.uri}`);
};

init();
