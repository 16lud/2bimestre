import { inject, Service } from '@angular/core';

@Service()
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
   readonly #http = inject(HttpClient);
  obterTodos(){
    return this.#http.get('${this.API}/deputados?ordem=ASC&ordenarPor=nome')
    ;

  }
}
