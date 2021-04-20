import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../index";

const router = express.Router();

// Get a user
router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const user = await prisma.user.findUnique({
			where: { id: Number(id) },
			select: {
				city: true,
				coverPicture: true,
				createdAt: true,
				desc: true,
				email: true,
				id: true,
				profilePicture: true,
				username: true,
				name: true,
			},
		});
		res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// Update user
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { userId, password } = req.body;
	delete req.body.userId;

	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (id === userId) {
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			try {
				const updatedUser = await prisma.user.update({
					where: { id: Number(id) },
					data: {
						...req.body,
						password: hashedPassword,
					},
				});
				res.status(200).json("Account has been updated!");
			} catch (error) {
				return res.status(400).json(error);
			}
		} else {
			try {
				const updatedUser = await prisma.user.update({
					where: { id: Number(id) },
					data: {
						...req.body,
					},
				});
				res.status(200).json("Account has been updated!");
			} catch (error) {
				return res.status(400).json(error);
			}
		}
	} else {
		res.status(403).json("You dont have permissions to update this account!");
	}
});

// Delete user
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (id === userId) {
		try {
			const user = await prisma.user.delete({
				where: {
					id: Number(id),
				},
			});
			res.status(200).json("Account has been deleted!");
		} catch (error) {
			return res.status(400).json(error);
		}
	} else {
		res.status(403).json("You dont have permissions to delete this account!");
	}
});

// Follow a user
router.post("/:id/follow", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	if (id !== userId) {
		try {
			const isFollowing = await prisma.user.findMany({
				where: {
					id: userId,
				},
				include: {
					following: true,
				},
			});
			console.log(isFollowing);
			// TODO: check if user is already followed
			if (true) {
				// const addFollower = await prisma.follower.create({
				// 	data: {
				// 		user: { connect: { id: userId } },
				// 	},
				// });
				const addFollowing = await prisma.following.create({
					data: {
						User: { connect: { id: Number(id) } },
					},
				});
				res.status(200).json("User has been followed!");
			} else {
				res.status(403).json("You allready follow this user!");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can't follow yourself!");
	}
});

// Unfollow a user
router.delete("/:id/unfollow", async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	if (id !== userId) {
		try {
			// TODO: check if user is already unfollowed

			const addFollower = await prisma.follower.deleteMany({
				where: { User: { followers: { some: { userId: userId } } } },
			});
			const addFollowing = await prisma.following.deleteMany({
				where: {
					User: {
						following: { some: { userId: Number(id) } },
					},
				},
			});
			res.status(200).json("User has been unfollowed!");
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can't unfollow yourself!");
	}
});

export default router;
