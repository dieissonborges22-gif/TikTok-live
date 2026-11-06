const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "TikTok LIVE Interactive" });
});

io.on("connection", (socket) => {
  console.log("Overlay conectado:", socket.id);

  socket.on("test-like", () => {
    io.emit("character-reaction", {
      type: "like",
      message: "Obrigado pelas curtidas! ❤️"
    });
  });

  socket.on("test-gift", () => {
    io.emit("character-reaction", {
      type: "gift",
      message: "Uau! Obrigado pelo presente! 🎁"
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TikTok LIVE Interactive rodando em http://localhost:${PORT}`);
  console.log("Abra esse endereço no navegador para testar o personagem.");
});
