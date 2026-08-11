import { Component, inject, signal } from '@angular/core';
import { DeputadoService } from '../deputado-service';
import { Deputado } from '../deputado';

@Component({
  selector: 'app-consulta-deputados',
  templateUrl: './consulta-deputados.html',
  styleUrls: ['./consulta-deputados.css'],
})
export class ConsultaDeputados {
  readonly #deputadoService = inject(DeputadoService);
  protected deputados = signal<Deputado[] | undefined>(undefined);

  constructor() {
    this.#deputadoService.obterTodos().subscribe((res) => {
      this.deputados.set(res.dados);
    });
  }
}
