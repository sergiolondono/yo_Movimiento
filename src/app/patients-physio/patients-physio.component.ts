import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { fadeInItems } from '@angular/material';

@Component({
  selector: 'app-patients-physio',
  templateUrl: './patients-physio.component.html',
  styleUrls: ['./patients-physio.component.css']
})
export class PatientsPhysioComponent implements OnInit {

  private sub: any;
  private userRegistred: any;
  patientsByPhysio$;
  patients$;
  physios$;
  physiosPatientsList$;
  users$;
  path = '/usuariosApp/';
  assignedPatients: any[] = [];
  physioSelected: any;
    
  ngOnInit() {
  }

  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router) { 

    
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userRegistred = params['userIdentification'] ;
      });

     db.list(this.path, {
      query: {
        orderByChild: 'perfil',
        equalTo: '2'
      }
    })
    .subscribe(usersInDb  =>{
      this.patients$ = usersInDb;
    });

    db.list(this.path, {
      query:{ 
        orderByChild: 'perfil',
        equalTo: '3'
      }
    })
    .subscribe(usersInDb  =>{
      this.physios$ = usersInDb;

      this.physiosPatientsList$ = this.physios$
      .filter(pp => pp.pacientes.length > 0);

      console.log(this.physiosPatientsList$ );
    });
    
  }

  onChange(eventArgs){
    console.log(eventArgs);
  }

  assignPatient(idUser, nameUser){
    if(!this.assignedPatients.find(ap => ap.cedulaPaciente == idUser))
    {
      this.assignedPatients.push({
        cedulaPaciente: idUser,
        nombrePaciente: nameUser
      });
    }
    else{
      this.assignedPatients
      .splice(this.assignedPatients.findIndex(ap => ap.cedulaPaciente == idUser), 1);
    }
    
    console.log(this.assignedPatients);
  }

  savePatients(key){

    this.db.object(this.path + key)
        .update({
          pacientes: this.assignedPatients
        });

    for(let i=0; i < this.assignedPatients.length ; i++){
      
      this.db.list(this.path, {
        query: {
          orderByChild: 'cedula',
          equalTo: this.assignedPatients[i].cedulaPaciente
        }
      }).subscribe(user =>{
        if(user.length > 0){
          this.db.object(this.path + user[0].$key) // Modificar la propiedad tieneFisio del paciente
          .update({
            tieneFisio: true
          });
        }
      });

    }
  }

}
