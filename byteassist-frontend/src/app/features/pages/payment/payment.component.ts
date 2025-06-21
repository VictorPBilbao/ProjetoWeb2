import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordidService } from '../../services/utils/recordid.service';
import { AuthService } from '../../services/auth/auth.service';
import { Budget } from '../../shared/models/budget.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recordIdService = inject(RecordidService);
  private readonly authService = inject(AuthService);

  private readonly taskId = this.route.snapshot.paramMap.get('taskId') ?? '';

  isModalVisible: boolean = false;
  isLoading = false;

  tiposServico = [
    'Atualização',
    'Formatação',
    'Configuração',
    'Limpeza',
    'Manutenção',
    'Troca de peças',
  ];
  opcoesParcelas = [1, 2, 3, 4, 5, 6, 10, 12];
  task = ['001', '005', '007', '009', '011', '013', '017', '018'];

  codigoBarras = '1234 5678 9012 3456 7890 1234 5678';
  chavePix = 'byte-assist@pix.com.br';
  qrCodeUrl: string = '';

  pagamento = {
    tipoServico: '',
    dataServico: '',
    task: '',
    empresa: 'Byte Assist',
    cnpj: '46.485.166/0001-46',
    valor: 0,
    tipoPagamento: '',
    numeroCartao: '',
    vencimentoCartao: '',
    nomeTitular: '',
    parcelas: 1,
  };

  // Método de inicialização que será chamado quando o componente for carregado
  ngOnInit(): void {
    // Garante que o código de barras e a chave Pix sejam gerados na inicialização
    this.codigoBarras = this.gerarCodigoBarras();
    this.chavePix = this.gerarChavePix();

    // Define a data atual como data do serviço
    const hoje = new Date();
    this.pagamento.dataServico = hoje.toISOString().split('T')[0];

    //  se a taskId estiver disponível, busca os dados da task caso contrário página n encontrada
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId, 'budget').subscribe({
        next: (task) => {
          this.pagamento.task = this.taskId;
          this.pagamento.tipoServico = task.type ?? '';
          this.pagamento.valor = (task.budget as Budget)?.amount ?? 0;
        },
        error: () => {
          console.error('Erro ao buscar dados da tarefa');
        },
      });
    }
  }

  submitForm() {
    this.isLoading = true; // Ativa o estado de loading (spinner aparece)

    this.taskService
      .updateTask({
        id: this.taskId,
        status: 'PAGA',
      })
      .subscribe({
        next: () => {
          console.log('Task atualizada com sucesso no backend.');
          // REMOVA O setTimeout AQUI
          this.isLoading = false; // Desativa o estado de loading (spinner some)
          this.isModalVisible = true; // Exibe o modal de confirmação (aparece imediatamente após o loading sumir)
        },
        error: (error) => {
          console.error('Erro ao atualizar a task:', error);
          this.isLoading = false; // Desativa o loading em caso de erro também
          // Você pode querer exibir uma mensagem de erro ou outro modal aqui.
        },
      });
  }

  // Método para fechar o modal
  fecharModal() {
    this.isModalVisible = false;
    this.router.navigate(['/solicitacao/', this.taskId]);
    // window.location.reload(); // Refresca a página após o fechamento do modal
  }

  // Lógica de mudança de tipo de pagamento
  onTipoPagamentoChange() {
    if (this.pagamento.tipoPagamento === 'BOLETO') {
      this.codigoBarras = this.gerarCodigoBarras();
    } else if (this.pagamento.tipoPagamento === 'PIX') {
      this.chavePix = this.gerarChavePix();
      this.qrCodeUrl = ''; // Limpa o QR anterior, se houver troca
    }
  }

  // Método para copiar a chave Pix para a área de transferência
  copiarChavePix() {
    navigator.clipboard
      .writeText(this.chavePix)
      .then(() => {
        alert('Chave Pix copiada com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao copiar a chave Pix:', err);
      });
  }

  // Método para gerar o QR Code
  gerarQrCode() {
    const pixData = this.chavePix;
    this.qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(
      pixData
    )}`;
  }

  // Método para gerar código de barras
  private gerarCodigoBarras(): string {
    return '34191.79001 01043.510047 91020.150008 6 85410000002000';
  }

  // Método para gerar chave Pix
  private gerarChavePix(): string {
    return `${Math.random().toString(36).substring(2, 15)}@byte-assist.com.br`;
  }
}
