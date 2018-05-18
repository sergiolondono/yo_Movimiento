//import { MatComponentsModule } from './mat-components/mat-components.module';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserapplicationComponent } from './userapplication/userapplication.component';
import { VideosassignmentComponent } from './videosassignment/videosassignment.component';
import { VideosuserComponent } from './videosuser/videosuser.component';
import { HttpUtilService } from './services/http-util-service';
import { YoutubePlaylist } from './services/youtube-playlist';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [ 
  {
    path: 'home',
    component: HomeComponent
  }, 
   {
    path: 'videosAssignment',
    component: VideosassignmentComponent
  },
  { 
    path: 'usersapplication',
    component: UserapplicationComponent
  },
  { 
    path: 'videosUser',
    component: VideosuserComponent
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserapplicationComponent,
    VideosassignmentComponent,
    VideosuserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    //MatComponentsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [HttpUtilService,YoutubePlaylist],
  bootstrap: [AppComponent]
})
export class AppModule { }
