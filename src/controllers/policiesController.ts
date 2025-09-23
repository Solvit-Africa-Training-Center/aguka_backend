import { Request, Response } from 'express';
import policiesServices, { PoliciesService } from '../services/policiesServices';

export class PoliciesController {
  // Update loan interest rate policy by type
  async updateLoanInterestRate(req: Request, res: Response) {
    try {
      const { rate } = req.body;
      if (typeof rate !== 'number' || rate <= 0) {
        return res.status(400).json({ message: 'Invalid interest rate' });
      }
      // Find the LOAN_INTEREST policy by type
      const policy = await policiesServices.getPolicyByType('LOAN_INTEREST');
      if (!policy) {
        return res.status(404).json({ message: 'LOAN_INTEREST policy not found' });
      }
      // Update the rate
      const updatedPolicy = await policiesServices.updatePolicy(policy.id, { rate });
      res.status(200).json({ message: 'Loan interest rate updated', policy: updatedPolicy });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update loan interest rate', error });
    }
  }
  async createPolicy(req: Request, res: Response) {
    try {
      const policy = await policiesServices.createPolicy(req.body);
      res.status(201).json(policy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create policy', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const policies = await policiesServices.getAllPolicies();
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve policies', error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const policy = await policiesServices.getPolicyById(req.params.id);
      if (!policy) return res.status(404).json({ message: 'Policy not found' });
      res.status(200).json(policy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve policy', error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const policy = await policiesServices.updatePolicy(req.params.id, req.body);
      if (!policy) return res.status(404).json({ message: 'Policy not found' });
      res.status(200).json(policy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update policy', error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await policiesServices.deletePolicy(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Policy not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete policy', error });
    }
  }
}
export default new PoliciesController();
