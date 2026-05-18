export interface WorkflowNode {
  id: string
  label: string
  type: string
  x: number
  y: number
}

export interface WorkflowEdge {
  from: string
  to: string
}

export interface WorkflowDiagram {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export const workflowDiagrams: Record<string, WorkflowDiagram> = {
  'paystack-webhook-slack': {
    nodes: [
      { id: 'n1', label: 'Webhook', type: 'trigger', x: 0, y: 0 },
      { id: 'n2', label: 'Is Successful?', type: 'condition', x: 1, y: 0 },
      { id: 'n3', label: 'Format Data', type: 'code', x: 2, y: -1 },
      { id: 'n4', label: 'Send Slack', type: 'action', x: 3, y: -1 },
      { id: 'n5', label: 'Log Event', type: 'code', x: 2, y: 1 },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n2', to: 'n5' },
      { from: 'n3', to: 'n4' },
    ],
  },
  'termii-otp-verification': {
    nodes: [
      { id: 'n1', label: 'Send OTP', type: 'trigger', x: 0, y: -1 },
      { id: 'n2', label: 'Generate Code', type: 'code', x: 1, y: -1 },
      { id: 'n3', label: 'Termii SMS', type: 'action', x: 2, y: -1 },
      { id: 'n4', label: 'Store OTP', type: 'code', x: 3, y: -1 },
      { id: 'n5', label: 'Verify OTP', type: 'trigger', x: 0, y: 1 },
      { id: 'n6', label: 'Check Code', type: 'condition', x: 1, y: 1 },
      { id: 'n7', label: 'Verified ✓', type: 'action', x: 2, y: 0 },
      { id: 'n8', label: 'Failed ✗', type: 'action', x: 2, y: 2 },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
      { from: 'n6', to: 'n8' },
    ],
  },
  'flutterwave-reconciliation-sheets': {
    nodes: [
      { id: 'n1', label: 'Every 8am', type: 'trigger', x: 0, y: 0 },
      { id: 'n2', label: 'Set Date Range', type: 'code', x: 1, y: 0 },
      { id: 'n3', label: 'Fetch Transactions', type: 'action', x: 2, y: 0 },
      { id: 'n4', label: 'Format Rows', type: 'code', x: 3, y: 0 },
      { id: 'n5', label: 'Any Results?', type: 'condition', x: 4, y: 0 },
      { id: 'n6', label: 'Append Sheets', type: 'action', x: 5, y: -1 },
      { id: 'n7', label: 'Notify Slack', type: 'action', x: 6, y: -1 },
      { id: 'n8', label: 'Log Empty', type: 'code', x: 5, y: 1 },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6' },
      { from: 'n5', to: 'n8' },
      { from: 'n6', to: 'n7' },
    ],
  },
}

export function getDefaultDiagram(apis: string[], difficulty: string): WorkflowDiagram {
  const nodeCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 5 : 7
  const nodes: WorkflowNode[] = [
    { id: 'n1', label: 'Trigger', type: 'trigger', x: 0, y: 0 },
  ]
  for (let i = 1; i < nodeCount - 1; i++) {
    nodes.push({ id: `n${i + 1}`, label: apis[i - 1] ? apis[i - 1].charAt(0).toUpperCase() + apis[i - 1].slice(1) : `Step ${i + 1}`, type: i % 2 === 0 ? 'code' : 'action', x: i, y: 0 })
  }
  nodes.push({ id: `n${nodeCount}`, label: 'Output', type: 'action', x: nodeCount - 1, y: 0 })
  const edges: WorkflowEdge[] = nodes.slice(0, -1).map((n, i) => ({ from: n.id, to: nodes[i + 1].id }))
  return { nodes, edges }
}
