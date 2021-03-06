class CFProposal {
  version: number;
  hash: string;
  blockHash: string;
  description: string;
  requestedAmount: number;
  notPaidYet: number;
  userPaidFee: number;
  paymentAddress: string;
  proposalDuration: number;
  expiresOn: number;
  votesYes: number;
  votesNo: number;
  votingCycle: number;
  status: string;
  state: number;

  stateChangedOnBlock?: string;
  paymentRequests?: Array<CFPaymentRequest>;
}

export default CFProposal;
