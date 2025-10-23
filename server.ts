import app from "./src/app";

const startServer = () => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is listening on port: http://localhost:${port}`);
  });
};

startServer();
