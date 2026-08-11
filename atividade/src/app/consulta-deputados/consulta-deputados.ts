import { Component, inject, signal, OnInit } from '@angular/core';
import { DeputadoService } from '../deputado-service';
import { Deputado, Legislatura } from '../deputado';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-consulta-deputados',
  imports: [NgOptimizedImage],
  templateUrl: './consulta-deputados.html',
  styleUrls: ['./consulta-deputados.css'],
})
export class ConsultaDeputados implements OnInit {
  readonly #deputadoService = inject(DeputadoService);
  protected deputados = signal<Deputado[] | undefined>(undefined);
  protected carregando = signal<boolean>(true);
  protected erro = signal<string>('');
  protected legislaturas = signal<Map<number, Legislatura>>(new Map());

  ngOnInit(): void {
    this.carregarDeputados();
  }

  carregarDeputados(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.#deputadoService.obterTodos().subscribe({
      next: (res) => {
        this.deputados.set(res.dados);
        this.carregarLegislaturas(res.dados);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar deputados.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  private carregarLegislaturas(deputados: Deputado[]): void {
    const idsUnicos = new Set(deputados.map(d => d.idLegislatura));
    const mapa = new Map<number, Legislatura>();
    let carregadas = 0;

    idsUnicos.forEach(id => {
      this.#deputadoService.obterLegislatura(id).subscribe({
        next: (res) => {
          if (res.dados && res.dados.length > 0) {
            mapa.set(id, res.dados[0]);
          }
          carregadas++;
          if (carregadas === idsUnicos.size) {
            this.legislaturas.set(mapa);
            this.carregando.set(false);
          }
        },
        error: () => {
          carregadas++;
          if (carregadas === idsUnicos.size) {
            this.legislaturas.set(mapa);
            this.carregando.set(false);
          }
        },
      });
    });
  }

  obterDataInicio(idLegislatura: number): string {
    const legislatura = this.legislaturas().get(idLegislatura);
    if (!legislatura) return 'Data indisponível';
    const date = new Date(legislatura.dataInicio);
    return date.toLocaleDateString('pt-BR');
  }

  obterDataFim(idLegislatura: number): string {
    const legislatura = this.legislaturas().get(idLegislatura);
    if (!legislatura) return 'Data indisponível';
    const date = new Date(legislatura.dataFim);
    return date.toLocaleDateString('pt-BR');
  }
}
