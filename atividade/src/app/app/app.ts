import { Component, signal } from '@angular/core';
import { ConsultaDeputados } from '../consulta-deputados/consulta-deputados';

@Component({
  selector: 'app-app',
  imports: [ConsultaDeputados],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('atividade');
}
