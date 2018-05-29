import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

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

  constructor(private db: AngularFireDatabase) { 
    this.usuariosApp$ = db.list('/usuariosApp/');

    this.db.list('/perfiles/')
    .subscribe(profiles => {
      this.perfiles = profiles;
    });

   }
  
  ngOnInit() {
  }
}
