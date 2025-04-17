export class User {
  constructor(
    public id: string = '',
    public username: string = '',
    public password: string = '',
    public fullName: string = '',
    public cpf: string = '',
    public dateOfBirth: Date = new Date(),
    public gender: string = '',
    public email: string = '',
    public phone: string = '',
    public zipCode: string = '',
    public state: string = '',
    public city: string = '',
    public neiborhood: string = '',
    public street: string = '',
    public number: string = '',
    public complement: string = ''
  ) { }
}
