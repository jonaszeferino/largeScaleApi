import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

type ApiResponse = {
  timestamp: number;
  message: string;
};

const requestLimit = 10; // Limite de requisições por segundo
const windowTime = 1; // Janela de tempo em segundos

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const cacheKey = "request_count"; // Chave para contar requisições
  const currentTimestamp = Date.now();

  // Recupera o número atual de requisições do Redis
  const requestCount = (await redis.get<number>(cacheKey)) || 0;

  if (requestCount >= requestLimit) {
    // Limite excedido
    return res.status(429).json({
      timestamp: currentTimestamp,
      message: "Too many requests, please try again later.",
    });
  }

  // Incrementa o contador no Redis com expiração de 1 segundo
  await redis.set(cacheKey, requestCount + 1, { ex: windowTime });

  // Resposta normal da API
  const message = "potato potato";
  return res.status(200).json({ timestamp: currentTimestamp, message });
}
