import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatNewMessageAreaComponent } from './chat-new-message-area/chat-new-message-area.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpService } from './http.service';
import { HttpServiceMock } from './http.service.mock';
import { MessageComponent } from './message/message.component';
import { UserViewComponent } from './user-view/user-view.component';
import { HttpServiceNode } from './http.service.node';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    ChatUserListComponent,
    ChatMessageListComponent,
    ChatNewMessageAreaComponent,
    MessageComponent,
    UserViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Importowanie modułu HTTP
    HttpClientModule,
    ReactiveFormsModule,
    
    MDBBootstrapModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatCheckboxModule,
    
  ],
  providers: [
    {
      provide: 'HttpServiceInterface',
      useExisting: HttpServiceNode
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
