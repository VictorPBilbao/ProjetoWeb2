export class Budget {
  constructor(
    public id: string = '',
    public userId: string = '',
    public date: Date = new Date(),
    public time: string = '',
    public equipment: string = '',
    public status: string = 'Orçada',
    public budgetValue: number = 0,
    public partsDescription: string = '',
    public laborDescription: string = '',
    public serviceName: string = '',
    public serviceDescription: string = '',
    public budgetPartsValue: number = 0,
    public budgetLaborValue: number = 0,
    public treasurerName: string = '',
    public accountantName: string = '',
  ) { }
}
