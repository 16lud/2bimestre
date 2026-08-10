import { Component,signal } from '@angular/core';
import {consulta-deputados} from '../consulta-deputados/consulta-deputados';


@Component({
  selector: 'app-app',
  imports: [consulta-deputados],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
