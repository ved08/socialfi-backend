import express, { Request, Response } from 'express';
import axios from "axios"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import dotenv from "dotenv"
import vybeApi from "@api/vybe-api"
import { prisma } from "./prisma/prisma"

// dotenv.config()
const app = express();
app.use(express.json())
const JUP_ENDPOINT = "https://lite-api.jup.ag"
// vybeApi.auth(process.env.VYBE_API || "")


app.get("/", (req, res) => {
    res.send("Hello world")
})
///WILL IMPLEMENT LATER
app.post("/token-history", async (req, res) => {
    const response = await axios.get(
        `https://api.vybenetwork.xyz/price/${req.body.mintAddress}/token-ohlcv?resolution=${req.body.resolution}`,
        {
            headers: {
                'X-API-KEY': process.env.VYBE_API || "",
                'accept': 'application/json',
            },
        }
    );
    console.log(response.data)
    res.send("hello world")

})
app.post("/token-details", async (req, res) => {
    const tokenDetails = await axios.get(`${JUP_ENDPOINT}/price/v2?ids=${req.body.tokenMints}&vsToken=So11111111111111111111111111111111111111112`)
    console.log(tokenDetails.data)
    res.send(tokenDetails.data)
})
app.post("/token-data", async (req, res) => {
    const { mint } = req.body
    const tokenData = await axios.get(`${JUP_ENDPOINT}/tokens/v1/token/${mint}`)
    console.log(tokenData.data)
    res.send(tokenData.data)
})
app.post("/swap", async (req, res) => {
    try {
        console.log("swapping....")
        console.log(req.body)
        const inputMint = req.body.inputMint
        const outputMint = req.body.outputMint
        const amount = req.body.amount
        const slippage = "50"
        const quoteResponse = await axios.get(
            `${JUP_ENDPOINT}/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps${slippage}`
        )
        const swapResponse = await axios.post(`${JUP_ENDPOINT}/swap/v1/swap`, {
            quoteResponse: quoteResponse.data,
            userPublicKey: new PublicKey(req.body.userPublicKey),
            dynamicComputeUnitLimit: true,
            dynamicSlippage: true,
            prioritizationFeeLamports: {
                priorityLevelWithMaxLamports: {
                    maxLamports: 1000000,
                    priorityLevel: "veryHigh"
                }
            }
        })
        console.log(swapResponse.data)
        res.json({
            error: false,
            message: "Success",
            transaction: swapResponse.data.swapTransaction,
        })
    } catch (e: any) {
        res.json({
            error: true,
            message: "Error building transaction"
        })
        console.log(e.message)
    }
})
app.post("/create-user", async (req, res) => {
    const { name, avatar } = req.body
    const user = await prisma.user.create({
        data: {
            name,
            avatar
        }
    })
    res.send("hello world")

})
app.post("/get-user", async (req, res) => {
    const { name } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            name
        }
    })
    console.log("got request", user)
    if (user) {
        res.send(true)
    } else {
        res.send(false)
    }
})
// Create a new post
app.post("/create-post", async (req: any, res: any) => {
    try {
        const { userName, mint, boughtAmt, holding, soldAmt } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { name: userName }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the post
        const post = await prisma.post.create({
            data: {
                userName,
                mint,
                boughtAmt: parseFloat(boughtAmt),
                holding: holding === 'true' || holding === true,
                soldAmt: soldAmt ? parseFloat(soldAmt) : 0
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get posts by user
app.get("/users/:userName/posts", async (req, res) => {
    try {
        const { userName } = req.params;
        const posts = await prisma.post.findMany({
            where: { userName },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(3000, () => {
    console.log("listening in port 3000")
});