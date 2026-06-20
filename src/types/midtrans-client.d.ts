declare module "midtrans-client" {
  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  interface SnapInstance {
    createTransaction(params: Record<string, unknown>): Promise<TransactionResult>;
  }

  interface SnapConstructor {
    new (config: { isProduction: boolean; serverKey: string; clientKey: string }): SnapInstance;
  }

  const midtransClient: { Snap: SnapConstructor };
  export default midtransClient;
}
