import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import tweetRouter from "./routes/tweets";

// Init
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/tweets", tweetRouter);

// Routes
app.get("/", (req, res) => {
	res.send("Hello");
});

app.listen(process.env.PORT, () => console.log(`Server is running on: http://localhost:${process.env.PORT}`));
