import { MedusaRequest } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { sanityFullSyncWorkflow } from '../../../../workflows/sanity/sanity-full-sync';

export const POST = async (req, res) => {
  const { transaction } = await sanityFullSyncWorkflow(req.scope).run({
    input: {},
  });

  res.json({ transaction_id: transaction.transactionId });
};

export const GET = async (req: MedusaRequest, res) => {
  const workflowEngine = req.scope.resolve(Modules.WORKFLOW_ENGINE);

  const [executions, count] = await workflowEngine.listAndCountWorkflowExecutions(
    {
      workflow_id: sanityFullSyncWorkflow.getName(),
    },
    { order: { created_at: 'DESC' } },
  );

  res.json({ workflow_executions: executions, count });
};
