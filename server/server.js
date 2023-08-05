if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Document = require("./Modal/Document");
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })

  .then(() => console.log("Database Connected Successfully ss"))

  .catch((err) => console.log(err));

const defaultValue = "";

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOneOrCreate(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  // console.log("conntected");
});

async function findOneOrCreate(id) {
  if (id == null) return;

  const document = await Document.findById(id);

  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
