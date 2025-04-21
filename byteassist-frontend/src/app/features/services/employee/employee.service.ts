import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  // Chave do localStorage para armazenar as solicitações
  private solicitacoesKey = 'solicitacoes';

   private solicitacoesIniciais: Employee[] = [
    { 
      id: 1, 
      data: '2025-02-27', 
      hora: '14:00', 
      equipamento: 'Samsung Book4 360 Intel Core', 
      estado: 'ABERTA',
      servico: 'Manutenção', 
      orcamento: '', 
      funcionario: 'Guilherme Arthur', 
      historico: 'Solicitação criada', 
      acao: 'Efetuar Orçamento',
      cor: 'cinza',
      categoria: 'Notebook',
      marca: 'Dell',
      descricaoServico: 'Verificar funcionamento geral do notebook.',
      defeitoRelatado: 'Desligamento inesperado.'
    },
    { 
      id: 2, 
      data: '2025-03-19', 
      hora: '10:30', 
      equipamento: 'Galaxy S23', 
      estado: 'ORÇADA',
      servico: 'Atualização', 
      orcamento: 'R$ 200,00', 
      funcionario: 'Guilherme Arthur', 
      historico: 'Aguardando aprovação', 
      acao: 'Efetuar Orçamento',
      cor: 'marrom',
      categoria: 'Smartphone',
      marca: 'Samsung',
      descricaoServico: 'Atualização de hardware e sistema.',
      defeitoRelatado: 'Lento ao inicializar.'
    },
    {
      id: 3,
      data: '2025-03-25',
      hora: '16:15',
      equipamento: 'Galaxy Tab 8',
      estado: 'REJEITADA',
      servico: 'Limpeza',
      orcamento: 'R$ 50,00',
      funcionario: 'Victor Bilbao',
      historico: 'Rejeitada pelo cliente',
      acao: '',
      cor: 'vermelho',
      categoria: 'Tablet',
      marca: 'Samsung',
      descricaoServico: 'Limpeza interna e externa.',
      defeitoRelatado: 'Tela engordurada e lenta.'
    },
    {
      id: 4,
      data: '2025-03-30',
      hora: '09:00',
      equipamento: 'Iphone 16',
      estado: 'APROVADA',
      servico: 'Formatação',
      orcamento: 'R$ 300,00',
      funcionario: 'Guilherme Arthur',
      historico: 'Orçamento aprovado',
      acao: 'Efetuar Manutenção',
      cor: 'amarelo',
      categoria: 'Smartphone',
      marca: 'Apple',
      descricaoServico: 'Formatação completa com backup.',
      defeitoRelatado: 'Sistema travando.'
    },
    {
      id: 5,
      data: '2025-04-05',
      hora: '11:45',
      equipamento: 'Acer Aspire 3',
      estado: 'REDIRECIONADA',
      servico: 'Configuração',
      orcamento: 'R$ 150,00',
      funcionario: 'Guilherme Arthur',
      historico: 'Solicitação redirecionada',
      destinoFuncionario: 'Carlos Pereira',
      acao: 'Efetuar Manutenção',
      cor: 'roxo',
      categoria: 'Notebook',
      marca: 'Acer',
      descricaoServico: 'Configuração inicial de sistema e rede.',
      defeitoRelatado: 'Sem conexão com Wi-Fi.'
    },
    {
      id: 6,
      data: '2025-04-11',
      hora: '13:30',
      equipamento: 'Tab Le Novo',
      estado: 'ARRUMADA',
      servico: 'Limpeza',
      orcamento: 'R$100,00',
      funcionario: 'Victor Bilbao',
      historico: 'Manutenção concluída',
      acao: '',
      cor: 'azul',
      categoria: 'Tablet',
      marca: 'Le Novo',
      descricaoServico: 'Limpeza técnica.',
      defeitoRelatado: 'Som abafado.'
    },
    {
      id: 7,
      data: '2025-04-12',
      hora: '15:20',
      equipamento: 'Computador',
      estado: 'PAGA',
      servico: 'Troca de peças',
      orcamento: 'R$ 800,00',
      funcionario: 'Guilherme Arthur',
      historico: 'Pagamento efetuado',
      acao: 'Finalizar Solicitação',
      cor: 'alaranjado',
      categoria: 'Desktop',
      marca: 'Dell',
      descricaoServico: 'Substituição de fonte e memória.',
      defeitoRelatado: 'Não liga.'
    },
    {
      id: 8,
      data: '2025-04-15',
      hora: '12:00',
      equipamento: 'Dell Inspiron I15',
      estado: 'FINALIZADA',
      servico: 'Configuração',
      orcamento: 'R$ 250,00',
      funcionario: 'Guilherme Arthur',
      historico: 'Solicitação finalizada',
      acao: '',
      cor: 'verde',
      categoria: 'Notebook',
      marca: 'Dell',
      descricaoServico: 'Configuração de contas e apps.',
      defeitoRelatado: 'Dificuldade para configurar e-mail.'
    }
  ];
  
  // Variável para controlar o último ID utilizado
  private lastId: number;

  private solicitacoesSubject = new BehaviorSubject<Employee[]>(this.obterSolicitacoesDoStorage());

  solicitacoes$ = this.solicitacoesSubject.asObservable();

  constructor() {
    const solicitacoes = this.obterSolicitacoesDoStorage();
    const maioresId = solicitacoes.length > 0
      ? Math.max(...solicitacoes.map(s => s.id))
      : 0;
  
    this.lastId = maioresId;
  
  
    // Se o localStorage estiver vazio, mescla as solicitações iniciais
    if (solicitacoes.length === 0) {
      this.salvarSolicitacoesNoStorage(this.solicitacoesIniciais);
      this.solicitacoesSubject.next(this.solicitacoesIniciais);
    }
  }

  private obterSolicitacoesDoStorage(): Employee[] {
    const solicitacoes = localStorage.getItem(this.solicitacoesKey);
    const parsedSolicitacoes = solicitacoes ? JSON.parse(solicitacoes) : [];

    // Ordena as solicitações por data (do mais recente para o mais antigo)
    return parsedSolicitacoes.sort((a: Employee, b: Employee) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  private salvarSolicitacoesNoStorage(solicitacoes: Employee[]): void {
    localStorage.setItem(this.solicitacoesKey, JSON.stringify(solicitacoes));
  }

  listar() {
    return this.solicitacoes$;
  }

 
  adicionar(solicitacao: Employee) {
    // Incrementa o último ID para garantir sequência
    this.lastId++;

    // Atribui o ID da solicitação com o último ID
    solicitacao.id = this.lastId;

    // A data precisa ser capturada no formato desejado
    if (!solicitacao.data) {
      solicitacao.data = new Date().toISOString().split('T')[0];  // Formata para 'yyyy-mm-dd'
    }

    // Obtém as solicitações atuais
    const solicitacoes = this.obterSolicitacoesDoStorage();
    
    // Adiciona a nova solicitação ao array
    solicitacoes.push(solicitacao);

    //ordena por data e hora
    const sortedSolicitacoes = solicitacoes.sort((a: Employee, b: Employee) => {
      const dataHoraA = new Date(`${a.data}T${a.hora}:00`).getTime(); // sufixo :00 para completar segundos
      const dataHoraB = new Date(`${b.data}T${b.hora}:00`).getTime();
      return dataHoraB - dataHoraA;
    });
    
    // Salva novamente no localStorage
    this.salvarSolicitacoesNoStorage(sortedSolicitacoes);

    // Atualiza o BehaviorSubject com o novo array
    this.solicitacoesSubject.next(sortedSolicitacoes);
  }
  
  // Método para editar uma solicitação existente
  editar(solicitacao: Employee) {
    const solicitacoes = this.obterSolicitacoesDoStorage();
    const index = solicitacoes.findIndex(s => s.id === solicitacao.id);
    if (index !== -1) {
      solicitacoes[index] = solicitacao;
      this.salvarSolicitacoesNoStorage(solicitacoes); // Atualiza o localStorage
      this.solicitacoesSubject.next(solicitacoes); // Atualiza o BehaviorSubject
    }
  }

  // Método para remover uma solicitação
  remover(id: number) {
    let solicitacoes = this.obterSolicitacoesDoStorage();
    solicitacoes = solicitacoes.filter(s => s.id !== id);
    this.salvarSolicitacoesNoStorage(solicitacoes); // Atualiza o localStorage
    this.solicitacoesSubject.next(solicitacoes); // Atualiza o BehaviorSubject
  }

  // Método para buscar solicitação por ID
  buscarPorId(id: number): Employee | undefined {
    return this.obterSolicitacoesDoStorage().find(s => s.id === id);
  }

  // Método para obter todas as solicitações
  obterSolicitacoes(): Employee[] {
    return this.obterSolicitacoesDoStorage();
  }
}