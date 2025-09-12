import { Request, Response } from 'express';
import penaltyService from '../services/penaltyService';

class PenaltyController {
  async createPenalty(req: Request, res: Response) {
    try {
      // Get userId from token
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      // Merge userId into request body
      const penaltyData = { ...req.body, userId };
      const penalty = await penaltyService.createPenalty(penaltyData);
      res.status(201).json(penalty);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllPenalties(req: Request, res: Response) {
    try {
      const penalties = await penaltyService.getAllPenalties();
      res.status(200).json(penalties);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getUserPenalties(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const penalties = await penaltyService.getUserPenalties(userId);
      res.status(200).json(penalties);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async payPenalty(req: Request, res: Response) {
    try {
      const { penaltyId } = req.params;
      const { paymentMethod } = req.body;
      const penalty = await penaltyService.payPenalty(penaltyId, paymentMethod);
      res.status(200).json(penalty);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deletePenalty(req: Request, res: Response) {
    try {
      const { penaltyId } = req.params;
      const result = await penaltyService.deletePenalty(penaltyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
export default new PenaltyController();
