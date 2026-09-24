import { HealthPlan } from '../../health-plan/entities/health-plan.entity';

export class Patient {
  id: string;
  userId: string;
  cpf: string;
  phone: string;
  healthPlan?: HealthPlan; // Relacionamento opcional com o plano de saúde

  createdAt: Date;
  updatedAt: Date;
}
