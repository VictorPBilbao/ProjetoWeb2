import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class handleErrors {
  constructor () {}

  // Trata o erro corretamente, colocar em outra classe, pois será utilizado em todas as requisições
  public static handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erros do lado do cliente (ex: erro de rede, erro de validação)
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erros do lado do servidor (ex: backend offline, 500, 404)
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
