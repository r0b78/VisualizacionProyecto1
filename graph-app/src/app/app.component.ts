import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel } from 'src/app/data/data.model';
import { DataModelPoblacion } from 'src/app/data/dataPoblacion.model'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: Observable<DataModel>;
  dataPoblacion : Observable<DataModelPoblacion>;
  constructor(private http: HttpClient) {
    this.data = this.http.get<DataModel>('assets/dataPoblacion.json');
    this.dataPoblacion = this.http.
                          get<DataModelPoblacion>('assets/dataPoblacionDensidad.json');
  }
}