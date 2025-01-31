import type { NextApiRequest, NextApiResponse } from "next";

type ApiResponse = {
  timestamp: number;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const message = "potato potato"; 

  res.status(200).json({ timestamp: Date.now(), message });
}
