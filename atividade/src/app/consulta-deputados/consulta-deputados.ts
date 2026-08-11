import { Component, inject, signal, OnInit } from '@angular/core';
import { DeputadoService } from '../deputado-service';
import { Deputado } from '../deputado';

@Component({
  selector: 'app-consulta-deputados',
  templateUrl: './consulta-deputados.html',
  styleUrls: ['./consulta-deputados.css'],
})
export class ConsultaDeputados implements OnInit {
  readonly #deputadoService = inject(DeputadoService);

  protected deputados = signal<Deputado[]>([]);
  protected carregando = signal(true);
  protected erro = signal('');

  ngOnInit(): void {
    this.carregarDeputados();
  }

  carregarDeputados(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.#deputadoService.obterDeputadosComDatas().subscribe({
      next: (deputados) => {
        this.deputados.set(deputados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar deputados. Tente novamente.');
        this.carregando.set(false);
        console.error(err);
      },
    });
  }

  formatarData(data: string | undefined): string {
    if (!data) return 'Data indisponível';

    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  }
}
