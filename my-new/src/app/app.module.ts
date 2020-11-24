import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScrollEventComponent } from './Users/kimhaneui/Documents/GitHub/scrollEvent-pagination/my-new/src/scroll-event/scroll-event.component';

@NgModule({
  declarations: [
    AppComponent,
    ScrollEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
