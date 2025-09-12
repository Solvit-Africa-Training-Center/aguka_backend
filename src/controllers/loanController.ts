import { Request, Response } from "express";
import loanService from "../services/loanService";
import { IRequestUser } from "../middlewares/authMiddleware";

class LoanController {
  // Request a new loan
  async requestLoan(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({
        data: null,
        success: false,
      
        message: "User not authenticated",
      });
    }

      const { amount, durationMonths } = req.body;
      const user = (req as IRequestUser).user!;
      const userId = user.id! as string;
      console.log("User ID in requestLoan:", userId);

      if (!amount || !durationMonths) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const loan = await loanService.requestLoan(userId, amount, durationMonths);
      res.status(201).json({ message: "Loan requested successfully", loan });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  
  async getLoan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const loan = await loanService.getLoan(id);
      if (!loan) return res.status(404).json({ message: "Loan not found" });
      res.status(200).json(loan);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get loans for the logged-in user
  async getUserLoans(req: Request, res: Response) {
    try {
      const user = (req as IRequestUser).user!;
      const userId = user.id!;
      const loans = await loanService.getUserLoans(userId);
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get loans by group ID
  async getGroupLoans(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const loans = await loanService.getGroupLoans(groupId);
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get all loans (admin)
  async getAllLoans(req: Request, res: Response) {
    try {
      const loans = await loanService.getAllLoans();
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get loans by status
  async getLoansByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const loans = await loanService.getLoansByStatus(status);
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Update a loan
  async updateLoan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const loan = await loanService.updateLoan(id, updateData);
      res.status(200).json({ message: "Loan updated successfully", loan });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Delete a loan
  async deleteLoan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await loanService.deleteLoan(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Approve a loan (admin)
  async approveLoan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as IRequestUser).user;
      if (!user || !user.id || !user.role) {
        return res.status(401).json({ error: "Unauthorized: missing user info" });
      }
      const loan = await loanService.approveLoan(id, user.id, user.role);
      res.status(200).json({ message: "Loan approved successfully", loan });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // Deny a loan (admin)
  async denyLoan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as IRequestUser).user;
      if (!user || !user.id || !user.role) {
        return res.status(401).json({ error: "Unauthorized: missing user info" });
      }
      const loan = await loanService.denyLoan(id, user.id, user.role);
      res.status(200).json({ message: "Loan denied successfully", loan });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new LoanController();
