import { Request, Response } from 'express';
import RepaymentService from '../services/repaymentService';

export class RepaymentController {
  static async create(req: Request, res: Response) {
    try {
      // Get userId from token
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      // Merge userId into request body
      const repaymentData = { ...req.body, userId };
      const repayment = await RepaymentService.createRepayment(repaymentData);
      res.status(201).json(repayment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const repayments = await RepaymentService.getAll();
      res.status(200).json(repayments);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const repayment = await RepaymentService.getById(req.params.id);
      res.json(repayment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const repayment = await RepaymentService.update(req.params.id, req.body);
      res.json(repayment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await RepaymentService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getRemainingBalance(req: Request, res: Response) {
    try {
      const result = await RepaymentService.getRemainingBalance(req.params.loanId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
