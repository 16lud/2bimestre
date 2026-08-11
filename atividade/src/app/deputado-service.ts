import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin, switchMap, map, catchError, of } from 'rxjs';
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
      switchMap((res: DeputadosResponse) => {
        const deputados = res.dados;
        console.log('Total de deputados:', deputados.length);

        // Extrair IDs únicos de legislatura
        const idsUnicos = Array.from(new Set(deputados.map(d => d.idLegislatura)));
        console.log('IDs de legislatura únicos:', idsUnicos);

        // Se não há legislaturas, retornar deputados sem datas
        if (idsUnicos.length === 0) {
          console.log('Nenhuma legislatura encontrada');
          return of(deputados);
        }

        // Fazer requisições em paralelo para cada legislatura
        const requisicoes: Observable<LegislaturasResponse>[] = idsUnicos.map(id =>
          this.#http.get<LegislaturasResponse>(`${this.url}/legislaturas/${id}`).pipe(
            catchError((err) => {
              console.error(`Erro ao buscar legislatura ${id}:`, err);
              return of({ dados: [] } as LegislaturasResponse);
            })
          )
        );

        console.log('Fazendo', requisicoes.length, 'requisições de legislatura');

        // Se não há requisições, retornar deputados sem datas
        if (requisicoes.length === 0) {
          return of(deputados);
        }

        return forkJoin(requisicoes).pipe(
          map((respostas: LegislaturasResponse[]) => {
            console.log('Respostas das legislaturas:', respostas);
            
            const mapaLegislaturas = new Map<number, Legislatura>();

            respostas.forEach((res) => {
              if (res && res.dados && res.dados.length > 0) {
                const leg = res.dados[0];
                console.log(`Legislatura ${leg.id}: ${leg.dataInicio} a ${leg.dataFim}`);
                mapaLegislaturas.set(leg.id, leg);
              }
            });

            console.log('Mapa de legislaturas preenchido com', mapaLegislaturas.size, 'itens');

            // Mapear deputados com suas datas
            const deputadosComDatas = deputados.map((deputado) => {
              const legislatura = mapaLegislaturas.get(deputado.idLegislatura);
              const deputadoAtualizado: Deputado = {
                ...deputado,
                dataInicio: legislatura?.dataInicio,
                dataFim: legislatura?.dataFim,
              };
              
              if (deputado.id <= 3) {
                console.log(`Deputado: ${deputado.nome}, Legislatura: ${deputado.idLegislatura}, Datas:`, {
                  dataInicio: deputadoAtualizado.dataInicio,
                  dataFim: deputadoAtualizado.dataFim,
                });
              }
              
              return deputadoAtualizado;
            });

            console.log('Total de deputados com datas:', deputadosComDatas.length);
            return deputadosComDatas;
          }),
          catchError((err) => {
            console.error('Erro no forkJoin:', err);
            // Retornar deputados sem datas se houver erro
            return of(deputados);
          })
        );
      })
    );
  }

  obterLegislatura(idLegislatura: number): Observable<LegislaturasResponse> {
    return this.#http.get<LegislaturasResponse>(`${this.url}/legislaturas/${idLegislatura}`);
  }
}
