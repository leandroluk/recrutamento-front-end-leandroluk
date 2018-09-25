import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';

import { FcCheck } from '../+core/utils/fc-check';
import { IUser } from '../+core/interfaces/user.interface';
import { IResponseError } from '../+core/interfaces/response-error.interface';
import { Store } from '@ngrx/store';
import { IAppStore } from '../app-store.module';
import { UserOnline } from '../+core/session.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  public form: FormGroup;
  public email: FormControl;
  public password: FormControl;
  public passwordConfirmation: FormControl;
  public fullName: FormControl;
  public birthDate: FormControl;
  public zipCode: FormControl;
  public streetName: FormControl;
  public number: FormControl;
  public complement: FormControl;
  public neighbourhood: FormControl;
  public country: FormControl;
  public state: FormControl;
  public city: FormControl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toast: ToasterService,
    private store: Store<IAppStore>,
    private router: Router
  ) {
    this.formBuild();
  }

  private formBuild(): void {

    this.email = new FormControl(null, [FcCheck.required(), FcCheck.email()]);
    this.password = new FormControl(null, [FcCheck.required()]);
    this.passwordConfirmation = new FormControl(null, [FcCheck.required(), FcCheck.match('password', ['Senha', 'Confirme a Senha'])]);
    this.fullName = new FormControl(null, [FcCheck.required()]);
    this.birthDate = new FormControl(null, [FcCheck.required(), FcCheck.date()]);
    this.zipCode = new FormControl(null, [FcCheck.required(), FcCheck.cep()]);
    this.streetName = new FormControl(null, [FcCheck.required()]);
    this.number = new FormControl(null, [FcCheck.required(), FcCheck.digit()]);
    this.complement = new FormControl(null, []);
    this.neighbourhood = new FormControl(null, []);
    this.country = new FormControl('', [FcCheck.required()]);
    this.state = new FormControl(null, [FcCheck.required()]);
    this.city = new FormControl(null, [FcCheck.required()]);

    this.form = this.fb.group({
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      fullName: this.fullName,
      birthDate: this.birthDate,
      zipCode: this.zipCode,
      streetName: this.streetName,
      number: this.number,
      complement: this.complement,
      neighbourhood: this.neighbourhood,
      country: this.country,
      state: this.state,
      city: this.city
    });

  }

  public getErrors(...controls: FormControl[]) {
    try {
      return controls
        .filter(f => !!f.errors && (!f.pristine || !!f.parent['submitted']))
        .map(m => m.errors === null ? [] : Object.values(m.errors))
        .reduce(r => [].concat(r, []));
    } catch (e) {
      return [];
    }
  }

  public submit(value: IUser) {

    let data = Object.assign({}, value);
    let fBirthDate = new Date(Date.parse(data.birthDate));

    delete data.passwordConfirmation;
    data.birthDate = `${fBirthDate.getDay()}/${fBirthDate.getMonth()}/${fBirthDate.getFullYear()}`;

    this.http.post('https://www.improving.com.br/api/test/users', data).subscribe(
      res => {
        let user = Object.assign(data, res);
        this.store.dispatch(new UserOnline(user));
        this.router.navigateByUrl('/dashboard');
      },
      (err: IResponseError) => {
        if (err.status === 400) {
          this.toast.pop('error', err.error['message']);
        } else if (err.status === 409) {
          this.toast.pop('error', 'O email informado já existe.');
        } else if (err.status >= 500) {
          this.toast.pop('error', 'Houve um erro de comunicação com o servidor. Por favor tente novamente mais tarde.');
        } else {
          this.toast.pop('error', 'Ocorreu um erro não identificado. Tente novamente mais tarde.')
        }
      });

  }

}
