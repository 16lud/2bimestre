import { Component, inject, signal, OnInit } from '@angular/core';
import { DeputadoService } from '../deputado-service';
import { Deputado } from '../deputado';
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

  ngOnInit(): void {
    this.carregarDeputados();
  }

  carregarDeputados(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.#deputadoService.obterTodos().subscribe({
      next: (res) => {
        this.deputados.set(res.dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar deputados.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  obterAnoCandidatura(idLegislatura: number): number {
    return 2023 + (idLegislatura - 56) * 4;
  }
}
