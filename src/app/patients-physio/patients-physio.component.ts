import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { fadeInItems } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'app-patients-physio',
  templateUrl: './patients-physio.component.html',
  styleUrls: ['./patients-physio.component.css']
})
export class PatientsPhysioComponent implements OnInit, OnDestroy {

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
  subscriptionloadPatientsAvailable: Subscription;
  subscriptionloadPatientsPhysios: Subscription;
  
  index;

  ngOnInit() { }

  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastsManager) { 
    
    this.sub = this.route.queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userRegistred = params['userIdentification'] ;
      });

      this.loadPatientsPhysios();
      this.loadPatientsAvailable();
  }

  loadPatientsAvailable(){
    this.subscriptionloadPatientsAvailable = this.db.list(this.path, {
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
    this.subscriptionloadPatientsAvailable = this.db.list(this.path, {
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

    }else{
      this.toastr.warning('Selecciona un Fisioterapeuta');
    }

  }

  detachPatient(p, physiosPatientsList){
    if(physiosPatientsList.pacientes.find(ap => ap.cedulaPaciente == p.cedulaPaciente))
    {
      this.physios$.find(ap => ap.$key == physiosPatientsList.$key).pacientes

      physiosPatientsList.pacientes
      .splice(physiosPatientsList.pacientes.findIndex(ap => ap.cedulaPaciente == p.cedulaPaciente), 1);

      this.db.object(this.path + physiosPatientsList.$key)
      .update({
        pacientes: physiosPatientsList.pacientes
      });

      this.loadPatientsAvailable();
    }
  }

  ngOnDestroy(){
    if(this.subscriptionloadPatientsAvailable){
      this.subscriptionloadPatientsAvailable.unsubscribe();
    }
    if(this.subscriptionloadPatientsPhysios){
      this.subscriptionloadPatientsPhysios.unsubscribe();
    }
  }

}
