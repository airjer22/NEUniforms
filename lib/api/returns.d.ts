export type ReturnCondition = {
  status: 'no-issues' | 'has-issues';
  notes: string;
};

export type ReturnSubmission = {
  transactionId: string;
  returnDate: Date;
  condition: ReturnCondition;
  processorNotes?: string;
};

export function processUniformReturn(submission: ReturnSubmission): Promise<{
  success: boolean;
  transaction: any;
  inventory: string;
}>;