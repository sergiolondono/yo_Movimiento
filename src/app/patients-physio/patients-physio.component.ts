import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { fadeInItems } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

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
  physiosPatientsList$: any[] = [];
  physiosPatientsListLocal: any[] = [];
  users$;
  path = '/usuariosApp/';
  assignedPatients: any[] = [];
  physioSelected: any;
  subscription: Subscription;
  
  index;

  ngOnInit() { }

  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router) { 
    
    this.sub = this.route.queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userRegistred = params['userIdentification'] ;
      });

      this.loadPatientsPhysios();
      this.loadPatientsAvailable();
  }

  loadPatientsAvailable(){
    this.db.list(this.path, {
      query: {
        orderByChild: 'perfil',
        equalTo: '2'
        }
    }).subscribe(userInDb =>{
      this.patients$ = userInDb;

      for(let i = 0; i < this.physiosPatientsList$.length ; i++){
            if(this.physiosPatientsList$[i].pacientes){
              for(let j = 0; j < this.physiosPatientsList$[i].pacientes.length ; j++){

               this.patients$
                .splice(this.patients$.findIndex(ap => ap.cedula == 
                this.physiosPatientsList$[i].pacientes[j].cedulaPaciente), 1);
              }
            }
          }
    });
  }

  loadPatientsPhysios(){
    this.db.list(this.path, {
      query:{ 
        orderByChild: 'perfil',
        equalTo: '3'
      }
    })
    .subscribe(usersInDb  =>{
      this.physios$ = usersInDb;
      this.physiosPatientsList$ = [];
      // Show configurations Physios by Patients
      for(let i = 0; i < this.physios$.length ; i++){
        if(this.physios$[i].pacientes){
          this.physiosPatientsList$.push(this.physios$[i]);
        }
      }
    });
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
  }

  savePatients(key){
    if(key != '-'){
        this.physiosPatientsListLocal = this.physios$.find(ap => ap.$key == key).pacientes;
        if(this.physiosPatientsListLocal){
          for(let i=0 ; i < this.physiosPatientsListLocal.length ; i++){
                this.assignedPatients.push({
                      cedulaPaciente: this.physiosPatientsListLocal[i].cedulaPaciente,
                      nombrePaciente: this.physiosPatientsListLocal[i].nombrePaciente
                    });
            }
        }

        this.db.object(this.path + key)
            .update({
              pacientes: this.assignedPatients
            });

        this.loadPatientsAvailable();

        this.assignedPatients = [];
        // for(let i=0; i < this.assignedPatients.length ; i++){
          
        //   this.db.list(this.path, {
        //     query: {
        //       orderByChild: 'cedula',
        //       equalTo: this.assignedPatients[i].cedulaPaciente
        //     }
        //   }).subscribe(user =>{
        //     if(user.length > 0){
        //       this.db.object(this.path + user[0].$key) // Modificar la propiedad tieneFisio del paciente
        //       .update({
        //         tieneFisio: true
        //       });
        //     }
        //   });
        // }
    }else{
      alert('Selecciona un Fisioterapeuta');
    }

   }

  detachPatient(p, physiosPatientsList){

    if(physiosPatientsList.pacientes.find((ap => ap.cedulaPaciente == p.cedulaPaciente)))
    {
      physiosPatientsList.pacientes
      .splice(this.assignedPatients.findIndex(ap => ap.cedulaPaciente == p.cedulaPaciente), 1);

      this.db.object(this.path + physiosPatientsList.$key)
      .update({
        pacientes: physiosPatientsList.pacientes
      });

      this.loadPatientsAvailable();

    }
  }


    
  

}
