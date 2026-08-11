import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin, map, switchMap } from 'rxjs/operators';
import { DeputadosResponse, LideresResponse, LegislaturasResponse, Deputado, Legislatura } from './deputado';

@Injectable({ providedIn: 'root' })
export class DeputadoService {
  readonly url = 'https://dadosabertos.camara.leg.br/api/v2';
  readonly #http = inject(HttpClient);

  obterTodos(): Observable<DeputadosResponse> {
    return this.#http.get<DeputadosResponse>(`${this.url}/deputados?ordem=ASC&ordenarPor=nome`);
  }

  obterDeputadosComDatas(): Observable<Deputado[]> {
    return this.obterTodos().pipe(
      switchMap((res) => {
        const deputados = res.dados;
        
        // Extrair IDs únicos de legislatura
        const idsUnicos = Array.from(new Set(deputados.map(d => d.idLegislatura)));
        
        // Se não há legislaturas, retornar deputados sem datas
        if (idsUnicos.length === 0) {
          return new Observable(observer => observer.next(deputados));
        }
        
        // Fazer requisições em paralelo para cada legislatura
        const requisicoes = idsUnicos.map(id =>
          this.#http.get<LegislaturasResponse>(`${this.url}/legislaturas/${id}`)
        );
        
        return forkJoin(requisicoes).pipe(
          map((respostas) => {
            // Criar mapa de legislaturas: { id → {dataInicio, dataFim} }
            const mapaLegislaturas = new Map<number, Legislatura>();
            
            respostas.forEach((res) => {
              if (res.dados && res.dados.length > 0) {
                const leg = res.dados[0];
                mapaLegislaturas.set(leg.id, leg);
              }
            });
            
            // Mapear deputados com suas datas
            return deputados.map((deputado) => {
              const legislatura = mapaLegislaturas.get(deputado.idLegislatura);
              return {
                ...deputado,
                dataInicio: legislatura?.dataInicio,
                dataFim: legislatura?.dataFim,
              };
            });
          })
        );
      })
    );
  }

  obterLegislatura(idLegislatura: number): Observable<LegislaturasResponse> {
    return this.#http.get<LegislaturasResponse>(`${this.url}/legislaturas/${idLegislatura}`);
  }
}
