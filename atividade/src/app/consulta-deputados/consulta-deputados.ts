import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeputadoService } from '../deputado-service';
import { Lider } from '../deputado';

@Component({
  selector: 'app-consulta-deputados',
  imports: [FormsModule],
  templateUrl: './consulta-deputados.html',
  styleUrls: ['./consulta-deputados.css'],
})
export class ConsultaDeputados {
  readonly #deputadoService = inject(DeputadoService);
  protected lideres = signal<Lider[] | undefined>(undefined);
  protected idPartido = signal<number | null>(null);
  protected dataInicio = signal<string>('');
  protected dataFim = signal<string>('');
  protected erro = signal<string>('');
  protected carregando = signal<boolean>(false);

  buscarLideres(): void {
    if (!this.idPartido()) {
      this.erro.set('Por favor, informe o ID do partido');
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.#deputadoService
      .obterLideresPorPartido(
        this.idPartido()!,
        this.dataInicio() || undefined,
        this.dataFim() || undefined
      )
      .subscribe({
        next: (res) => {
          this.lideres.set(res.dados);
          this.carregando.set(false);
        },
        error: (err) => {
          this.erro.set('Erro ao buscar líderes. Verifique o ID do partido.');
          this.carregando.set(false);
          console.error(err);
        },
      });
  }

  buscarTodosLideres(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.#deputadoService
      .obterTodosLideres(
        this.dataInicio() || undefined,
        this.dataFim() || undefined
      )
      .subscribe({
        next: (res) => {
          this.lideres.set(res.dados);
          this.carregando.set(false);
        },
        error: (err) => {
          this.erro.set('Erro ao buscar líderes.');
          this.carregando.set(false);
          console.error(err);
        },
      });
  }

  formatarData(data: string | null): string {
    if (!data) return 'Indefinido';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}
