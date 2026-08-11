import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeputadosResponse, LideresResponse, LegislaturasResponse } from './deputado';

@Injectable({ providedIn: 'root' })
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
  readonly #http = inject(HttpClient);

  obterTodos(): Observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse>(`${this.url}/deputados?ordem=ASC&ordenarPor=nome`);
  }

  obterLegislatura(idLegislatura: number): Observable<LegislaturasResponse> {
    return this.#http.get<LegislaturasResponse>(`${this.url}/legislaturas/${idLegislatura}`);
  }

    return this.#http.get<LideresResponse>(url);
  }
}
