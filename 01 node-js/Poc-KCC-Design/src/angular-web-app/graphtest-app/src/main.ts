import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import this for HttpClient support

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Add this to provide HttpClient
  ],
})
  .catch((err) => console.error(err));
