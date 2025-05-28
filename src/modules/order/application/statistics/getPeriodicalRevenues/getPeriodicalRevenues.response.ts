export class RevenueDto {
  time: string;
  amount: number;
}

export class GetPeriodicalRevenuesQueryResponse {
  data: RevenueDto[];
}
