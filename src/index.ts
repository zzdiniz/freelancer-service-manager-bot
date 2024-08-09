import express, { Request, Response } from "express"
import TelegramBot from "node-telegram-bot-api"
import Message from "./types/Message"
import Bot from "./types/Bot"

const app = express()
const PORT = 5000
const PUBLIC_URL = "https://ferrarezzo.loca.lt/"
const BOT_TOKEN = "7205792626:AAG6abk_NdmONtDjefWIyiv3r0i70GyWDyg"

const bot = new TelegramBot(BOT_TOKEN, { webHook: true });
//bot.setWebHook(`${PUBLIC_URL}/webhook/4`);
//lt --port 5000 --subdomain ferrarezzo
app.use(express.json());

app.post('/webhook/:id',async (req:Request,res:Response)=>{
    const {id} = req.params
    const {message} = req.body
    console.log('teste',message)
    const response = await fetch(`http://localhost:3000/bot/get-by-id/${id}`);
    const botResponse:Bot = await response.json()

    const bot = new TelegramBot(botResponse.token)
    bot.sendMessage(message.chat.id,`Você disse: ${message.text}`)
    console.log(`data:${botResponse.name}`)
    return res.status(200).json({message: `Id retornado: ${id}`})
})
app.listen(PORT,()=>{
    console.log(`Runing bot on port: ${PORT}`)
})