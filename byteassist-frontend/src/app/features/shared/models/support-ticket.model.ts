export class SupportTicket {
  constructor(
    public id: string = '',
    public category: string = '',
    public subject: string = '',
    public description: string = '',
    public attachment?: File,
    public contactMethod: 'email' | 'phone' | 'whatsapp' = 'email',
    public status: 'open' | 'pending' | 'closed' = 'open',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

}
