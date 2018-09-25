import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import * as octicons from 'octicons';
import { IOcticon } from '../+core/interfaces/octicon.interface';

import { IAppStore } from '../app-store.module';
import { Store, select } from '@ngrx/store';
import { IUser } from '../+core/interfaces/user.interface';
import { ISession } from '../+core/interfaces/session.interface';
import { IResponseError } from '../+core/interfaces/response-error.interface';
import { ToasterService } from 'angular2-toaster';

interface IRawCities {
  name?: string;
  data?: [string, number][];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public icons: IOcticon[];
  public arrowRight: SafeHtml;
  public arrowMenu: SafeHtml;
  public mdWidth: boolean;
  public active: boolean;
  public tableMode: boolean;

  public user: IUser;
  private rawBrowsers: [string, number][];
  private rawCities: IRawCities[];

  @HostListener('window:resize', [])
  public onResize() {
    this.mdWidth = window.innerWidth >= 768;
  }

  constructor(
    private _sanitizer: DomSanitizer,
    private http: HttpClient,
    private store: Store<IAppStore>,
    private toast: ToasterService
  ) {

    this.icons = Object.values(octicons)
      .filter((i: IOcticon) => i.symbol.indexOf('arrow') == -1 && i.symbol.indexOf('chevron') == -1)
      .sort(() => .5 - Math.random()).slice(0, 10) as IOcticon[];

    this.arrowRight = octicons['chevron-right'];
    this.arrowMenu = octicons['three-bars'];

    this.store.pipe(select('session')).subscribe((session: ISession) => {

      let token = { token: session.user.token }

      this.http.post('https://www.improving.com.br/api/test/hits-by-browser', token)
        .subscribe((raw: [string, number][]) => this.rawBrowsers = raw, err => this.throwError(err));

      this.http.post('https://www.improving.com.br/api/test/city-temperatures', token)
        .subscribe((raw: IRawCities[]) => this.rawCities = raw, err => this.throwError(err));

    });

  }

  ngOnInit() {
    this.onResize();
  }

  public renderIcon(icon: IOcticon): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(icon.toSVG());
  }

  public getGraphBrowsers(): any {
    return !!this.rawBrowsers ? {
      options: { responsive: true, }, type: 'bar',
      datasets: this.rawBrowsers.map(x => ({ label: x[0], data: [x[1]] })),
    } : null;
  }

  public getGraphCities(): any {
    return !!this.rawCities ? {
      options: { responsive: true, }, type: 'bar',
      datasets: this.rawCities.map(x => ({
        label: x.name,
        data: [this.calcMedia(x.data.map(y => y[1]), 1)]
      }))
    } : null;
  }

  public getTableBrowsers(): any {

    if (!this.rawBrowsers) return;

    let total = this.rawBrowsers.map(x => x[1]).reduce((a, b) => a += b);

    return {
      head: ['Browser', 'Distribuição (%)'],
      body: this.rawBrowsers
        .map(x => [x[0], this.calcPercentage(x[1], total)])
        .sort((a, b) => this.sortTable(a, b))
    };

  }
  public getTableCities(): any {

    if (!this.rawCities) return;

    let joinMounth: number[][];
    let result: any[];

    return {
      head: ['Cidades', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      body: this.rawCities.map(x => {

        joinMounth = [[], [], [], [], [], [], [], [], [], [], [], []];
        result = [x.name];

        for (let i of x.data)
          joinMounth[parseInt(i[0].split('-')[1]) - 1].push(i[1]);

        for (let i = 0; i < joinMounth.length; i++)
          result.push(this.calcMedia(joinMounth[i], 1));

        return result;

      }).sort((a, b) => this.sortTable(a, b))
    };

  }

  private throwError(err: IResponseError): void {
    if (err.status >= 400)
      this.toast.pop('error', 'Há algum erro com o seu formato de requisição');
    if (err.status >= 500)
      this.toast.pop('error', 'Houve um erro de comunicação com o servidor. tente novamente mais tarde.');
  }

  private calcMedia(arr: number[], decimals: number = 2): number {
    return parseFloat((arr.reduce((a, b) => a += b) / arr.length).toFixed(decimals));
  }

  private calcPercentage(partial: number, total: number, decimals: number = 2): number {
    return parseFloat(((partial / total) * 100).toFixed(decimals));
  }

  private sortTable(a: any, b: any) {
    if (a[0] < b[0]) return -1;
    else if (a[0] > b[0]) return 1;
    else return 0;
  }

}
