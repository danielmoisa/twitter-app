import express from "express";
import { prisma } from "../index";

const router = express.Router();

// Create a new tweet
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
router.delete("/:id", async (req, res) => {
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

// Get a single tweet
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

// Like a tweet
router.post("/:id/like", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	try {
		const tweet = await prisma.like.findMany({
			where: {
				userId: {
					equals: userId,
				},
			},
		});

		if (tweet.length > 0) {
			res.status(500).json("You already liked this tweet!");
		} else {
			const like = await prisma.like.create({
				data: {
					Tweet: { connect: { id: Number(id) } },
					User: { connect: { id: Number(userId) } },
				},
			});
			res.status(200).json(like);
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get feed tweets
router.get("/", async (req, res) => {
	// const { userId } = req.body;
	try {
		// const usertweets = await prisma.tweet.findMany({
		// 	where: {
		// 		userId: userId,
		// 	},
		// });

		// const currentUser = await prisma.user.findUnique({
		// 	where: { id: userId },
		// 	include: { following: true },
		// });

		const feed = await prisma.tweet.findMany({
			include: {
				User: true,
			},
		});

		res.status(200).json(feed);
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
