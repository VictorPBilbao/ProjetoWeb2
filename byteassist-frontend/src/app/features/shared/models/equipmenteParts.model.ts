export class EquipmenteParts {
  constructor(
    public id: string = '',
    public partName: string = '',
    public partBrand: string = '',
    public partModel: string = '',
    public partSerialNumber: string = '',
    public partDescription: string = '',
    public partValue: number = 0,
    public partQuantity: number = 0,
    public partTotalValue: number = 0,
  ) {}
}
