import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/Models/user.model';
import { UserService } from 'src/app/Services/user.service';
import { Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../user.actions'
import * as fromUser from '../../user.selectors'

@Component({
  selector: 'app-pipes',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  search = "";
  status = -1
  addUserForm: FormGroup;
  disable = true;
  error = ""
  disableDelete = false
  appStatus = new Observable((observer) => {
    setTimeout(() => {
      observer.next(this.users)
    }, 500)
  })

  public users: User[] = [
  ];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private store: Store) { }

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      date: [null, [Validators.required]]
    });
    this.addUserForm.valueChanges.subscribe((data) => {
      this.disable = !(data.name && data.date);
    });
    this.getUsers()
  }

  getUsers() {
    // Dispatch Action from store
    this.store.dispatch(new UserActions.LoadUsers())

    this.store.pipe(select(fromUser.getUsers)).subscribe((data) => {
      this.users = data
    }
    )


    // this.userService.getUsers().subscribe((data) => {
    //   this.users = data
    // }
    //   , (error) => {
    //     this.status = 0
    //     this.error = error
    //     console.error(this.error)
    //     setTimeout(() => {
    //       this.status = -1;
    //     }, 5000)
    //   }
    // )
  }

  onAddUserClick() {
    if (this.addUserForm.valid) {
      this.addUserForm.value.name = this.addUserForm.value.name.trim()
      let data = this.addUserForm.value;
      this.userService.createUsers(data).subscribe((response: { name: string }) => {
        this.getUsers()
        if (response.name) {
          this.status = 1
          setTimeout(() => {
            this.status = -1
          }, 3000)
        }
      }, (error) => {
        this.error = error
        this.status = 0
        setTimeout(() => {
          this.status = -1;
        }, 5000)
      })
      this.addUserForm.reset();
    }
  }

  DeleteAllUsersClick() {
    if (confirm("This will delete every single user in the list are you sure you want to do it?")) {
      this.userService.removeAll().subscribe(res => this.users = [])
    }
  }

  DeleteOne(key: string) {
    this.userService.removeOne(key).subscribe((data) => {
      this.getUsers()
      if (data.type === HttpEventType.Sent) {
        this.disableDelete = true
      }
      else {
        this.disableDelete = false
      }
    }, (error) => {
      this.error = error
      this.status = 0
      setTimeout(() => {
        this.status = -1;
        this.disableDelete = false;
      }, 3000)
    })
  }
  Promote(user: User) {
    user.as = this.getStatus(user.as)
    let date = new Date;
    let strDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    user.date = strDate;
    this.userService.edit(user).subscribe((data) => {
      if (data.type === HttpEventType.Sent) {
        this.disableDelete = true
      }
      else {
        this.disableDelete = false
      }
      this.getUsers()
    }, (error) => {
      this.error = error
      this.status = 0
      setTimeout(() => {
        this.status = -1;
        this.disableDelete = false;
      }, 3000)
      this.getUsers()
    }
    )
  }
  getStatus(as) {
    let obj = {
      "ASE": "SE",
      "SE": "SSE",
      "SSE": "SA",
      "SA": "AM",
      "AM": "M",
      "M": "GM",
      "GM": "CEO",
      "CEO": "Retired",
      "Retired": "Retired"
    }
    return obj[as]
  }
}
