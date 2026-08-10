import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeputadosResponse } from './deputado';

@Service()
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
   readonly #http = inject(HttpClient);
  obterTodos() observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse> ('${this.API}/deputados?ordem=ASC&ordenarPor=nome')



  }
}
