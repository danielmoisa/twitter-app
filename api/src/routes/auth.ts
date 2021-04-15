import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});
		res.json(user);
	} catch (error) {
		console.log(error);
	}
});

// Login user
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (user) {
			const validPassword = await bcrypt.compare(password, user.password);
			if (validPassword) {
				return res.json(user);
			} else {
				res.status(400).send("Password is wrong!");
			}
		} else {
			res.status(404).send("User not found!");
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
