import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeputadosResponse } from './deputado';

@Service()
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
  readonly #http = inject(HttpClient);

  obterTodos(): Observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse>(`${this.url}/deputados?ordem=ASC&ordenarPor=nome`);



  }
}
