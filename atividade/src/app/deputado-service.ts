import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeputadosResponse } from './deputados-response';
import { Observable } from 'rxjs';

@Service()
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
   readonly #http = inject(HttpClient);
  obterTodos() observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse> ('${this.API}/deputados?ordem=ASC&ordenarPor=nome')



  }
}
