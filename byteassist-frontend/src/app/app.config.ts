import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MarkdownModule } from 'ngx-markdown';


import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideEnvironmentNgxMask(),
    importProvidersFrom(MarkdownModule.forRoot())
  ]
};
