import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  courses$: FirebaseListObservable<any[]>;
  authors$;
  author$;
  students$: FirebaseListObservable<any[]>;
  student$;
  queryStudent$;
  student3$;

  constructor(private db: AngularFireDatabase) {
    this.courses$ = db.list('/courses');
    this.authors$ = db.list('/authors');
    this.students$ = db.list('/students');
    this.student$ = db.object('/students/1');

    // const student2$ = db.list('/students', {
    //   query: {
    //     orderByChild: 'email',
    //     equalTo: name$
    //   }
    // });
    // student2$.subscribe(student => console.log(student));
    // name$.next('jhonwi@gmai.com');
  }

  getStudentbyEmail(student: HTMLInputElement) {
    const name$ = new Subject<string>();
    this.queryStudent$ = this.db.list('/students', {
      query: {
        orderByChild: 'email',
        equalTo: name$
      }
    }).subscribe(data => this.student3$ = data);
    name$.next(student.value);
  }

  add(course: HTMLInputElement) {
    this.courses$.push(course.value);
    course.value = '';
  }

  addStudent(student: HTMLInputElement) {
    this.students$.push({
      email: student.value,
      name: student.value
    });
  }

  update(course) {
    this.db.object('/courses/' + course.$key)
      .set(course.$value + ' UPDATED'); // To primitive value or a complex object
      // ** Set method updates all property **
      // .set({
      //   title: course.$value + ' UPDATED',
      //   price: 150
      // });
      // ** Update method only updates the properties we have listed on object**
      // .update({
      //   title: course.$value + ' UPDATED',
      //    price: 150
      // });
  }

  delete(course) {
    this.db.object('/courses/' + course.$key)
    .remove()
    .then(x => console.log('Deleted'));
  }
}
