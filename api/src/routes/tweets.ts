import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Create a tweet
router.post("/", async (req, res) => {
	try {
		const tweet = await prisma.tweet.create({
			data: {
				...req.body,
			},
		});
		res.status(200).json(tweet);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Update tweet
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	const tweet = await prisma.tweet.findUnique({
		where: { id: Number(id) },
	});

	if (tweet?.userId === userId) {
		try {
			const tweet = await prisma.tweet.update({
				where: {
					id: Number(id),
				},
				data: {
					...req.body,
				},
			});
			res.status(200).json(tweet);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can update only your tweet!");
	}
});

// Delete tweet
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	const tweet = await prisma.tweet.findUnique({
		where: { id: Number(id) },
	});

	if (tweet?.userId === userId) {
		try {
			const tweet = await prisma.tweet.delete({
				where: {
					id: Number(id),
				},
			});
			res.status(200).json(tweet);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can delete only your tweet!");
	}
});

// Like a tweet
router.post("/:id/like", async (req, res) => {
	const { tweetId } = req.body;
	try {
		// const tweet = await prisma.tweet.findUnique({
		// 	where: {
		// 		id: Number(id),
		// 	},
		// });
		// TODO: check if like already exists
		const tweets = await prisma.tweet.findMany({
			where: {},
		});

		console.log(tweets);

		if (tweets.length == 0) {
			// Create new like and connect with his tweet
			const like = await prisma.like.create({
				data: {
					Tweet: { connect: { id: tweetId } },
				},
			});
			res.status(200).json(like);
			// TODO: implement dislike
		} else {
			res.status(500).json("You already liked this tweet!");
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get a tweet
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const tweet = await prisma.tweet.findUnique({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json(tweet);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get feed tweets
router.get("/feed", async (req, res) => {
	const { userId } = req.body;
	const feed = [];
	try {
		const usertweets = await prisma.tweet.findMany({
			where: {
				userId: userId,
			},
		});

		const currentUser = await prisma.user.findUnique({
			where: { id: userId },
			include: { following: true },
		});

		res.status(200).json(usertweets);
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
