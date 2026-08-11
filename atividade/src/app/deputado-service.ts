import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeputadosResponse, LideresResponse } from './deputado';

@Injectable({ providedIn: 'root' })
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
  readonly #http = inject(HttpClient);

  obterTodos(): Observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse>(`${this.url}/deputados?ordem=ASC&ordenarPor=nome`);
  }

  obterLideresPorPartido(
    idPartido: number,
    dataInicio?: string,
    dataFim?: string
  ): Observable<LideresResponse> {
    let url = `${this.url}/partidos/${idPartido}/lideres`;
    const params = new URLSearchParams();

    if (dataInicio) {
      params.append('dataInicio', dataInicio);
    }
    if (dataFim) {
      params.append('dataFim', dataFim);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.#http.get<LideresResponse>(url);
  }

  obterTodosLideres(dataInicio?: string, dataFim?: string): Observable<LideresResponse> {
    let url = `${this.url}/lideres`;
    const params = new URLSearchParams();

    if (dataInicio) {
      params.append('dataInicio', dataInicio);
    }
    if (dataFim) {
      params.append('dataFim', dataFim);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.#http.get<LideresResponse>(url);
  }
}
