import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  toasterConfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: false,
    showCloseButton: false,
    defaultTypeClass: 'info',
    positionClass: 'toast-position',
    animation: 'fade',
  });

}
