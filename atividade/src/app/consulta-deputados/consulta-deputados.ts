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
    console.log('Iniciando carregamento de deputados...');

    this.#deputadoService.obterDeputadosComDatas().subscribe({
      next: (deputados) => {
        console.log('Deputados recebidos:', deputados.length);
        console.log('Primeiros 3 deputados:', deputados.slice(0, 3));
        this.deputados.set(deputados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar deputados:', err);
        this.erro.set('Erro ao carregar deputados. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  formatarData(data: string | undefined): string {
    if (!data) {
      return 'Data indisponível';
    }

    try {
      const date = new Date(data);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (err) {
      console.error('Erro ao formatar data:', data, err);
      return 'Data inválida';
    }
  }
}
