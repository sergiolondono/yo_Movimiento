import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videosByUser;
  perfiles;
  cedulaUserInDb: any;
  keyRowUser: any;
  usuariosApp$: FirebaseListObservable<any[]>;
  authentication;
  constructor(private db: AngularFireDatabase, aAuth: AuthService) { 
    this.usuariosApp$ = db.list('/usuariosApp/');

      aAuth.anonymousLogin();

      this.db.list('/perfiles/')
      .subscribe(profiles => {
        this.perfiles = profiles;
      });

   }
  
  ngOnInit() {
  }
}
