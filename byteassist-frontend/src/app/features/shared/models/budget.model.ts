import { EquipmenteParts } from '../models/equipmentParts.model'

export class Budget {
  constructor(
    public id: string = '',
    public userId: string = '',
    public date: Date = new Date(),
    public time: string = '',
    public equipment: string = '',
    public equipmentBrand : string = '',
    public status: string = 'Orçada',
    public equipmentCategory: string = '',
    public budgetValue: number = 0,
    public partsDescription: string = '',
    public laborDescription: string = '',
    public serviceName: string = '',
    public serviceDescription: string = '',
    public budgetPartsValue: number = 0,
    public budgetLaborValue: number = 0,
    public treasurerName: string = '',
    public accountantName: string = '',
    public rejectDescription: string = '',
    public defectDescription: string = '',
    public budgetDescription: string = '',
    public parts: EquipmenteParts[] = [],
    public clientName: string = '',
    public technicalName: string = '',
    public technicalHourValue: number = 0,
    public fees: number = 0,
    ) { }
  }
