import { Component, inject, signal } from '@angular/core';
import { DeputadoService } from '../deputado-service/deputado-service';
import {depiutado} from '../deputado/deputado';


@Component({
  selector: 'app-consulta-deputados',
  imports: [],
  templateUrl: './consulta-deputados.html',
  styleUrl: './consulta-deputados.css',
})
export class ConsultaDeputados {

  readonly #deputadoService = inject(DeputadoService);
  protected deputados =
  signal<deputado[] | undefined>;

  constructor() {
    this.#deputadoService.obterTodos().subscribe( res => {
      this.deputados.set(res.dados);
    });
}
}
