if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })

  .then(() => console.log("Database Connected Successfully ss"))

  .catch((err) => console.log(err));
// const express = require("express");
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    const data = "";
    socket.join(documentId);
    socket.emit("load-document", data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });

  // console.log("conntected");
});
// const port = process.env.PORT || 8080;
// const app = express();
// const mongoose = require("mongoose");
// const User = require("./routes/user");
// const Product = require("./routes/product");
// const Cart = require("./routes/cart");
// const Order = require("./routes/order");
// const authRoute = require("./routes/auth");
// const stripeRoute = require("./routes/stripe");
// const cors = require("cors");
// //configure bodyParser
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
// app.use(express.json());
// mongoose

//   .connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//   })

//   .then(() => console.log("Database Connected Successfully ss"))

//   .catch((err) => console.log(err));
// app.use(cors());
// app.use("/api/users", User);
// app.use("/api/auth", authRoute);
// app.use("/api/products", Product);
// app.use("/api/carts", Cart);
// app.use("/api/orders", Order);
// app.use("/api/checkout", stripeRoute);
// app.listen(port, () => {
//   console.log(`Listning on the port at ${port}`);
// });
