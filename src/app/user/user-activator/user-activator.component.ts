import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../service/user.model';
import { MyOriginAuthService } from 'src/app/auth/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-user-activator',
  templateUrl: './user-activator.component.html',
  styleUrls: ['./user-activator.component.scss']
})
export class UserActivatorComponent implements OnInit {
    userData: User
    state_info = true
    state_info1 = true
    agree_switch = false

    errors: any[] = []
    data : Date = new Date()
    closeResult: string

    constructor(
      private auth: MyOriginAuthService, 
      private router: Router
    ) { }

    ngOnInit() {
        let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        let body = document.getElementsByTagName('body')[0];
        body.classList.add('settings-page');
        this.getUser()
    }
    ngOnDestroy(){
        let navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        if (navbar.classList.contains('nav-up')) {
            navbar.classList.remove('nav-up');
        }
        let body = document.getElementsByTagName('body')[0];
        body.classList.remove('settings-page');
    }

    getUser() {
        const userId = this.auth.getUserId()
        this.auth.getUserById(userId).subscribe(
          (foundUser) => {
            this.userData = foundUser
          },
          (errorResponse: HttpErrorResponse) => {
            console.error(errorResponse)
            this.errors = errorResponse.error.errors    
          }
        )
    }

    updateUser(userForm: NgForm) {
        userForm.value.idOfPhoto1 = this.userData.idOfPhoto1
        userForm.value.idOfPhoto2 = this.userData.idOfPhoto2
        userForm.value.userRole = 'PendingTrainer'
        this.auth.updateUser(this.userData._id, userForm.value).subscribe(
            (UserUpdated) => {
                userForm.reset(userForm.value)
                this.showSwalSuccess()
            },
            (errorResponse: HttpErrorResponse) => {
              console.error(errorResponse)
              this.errors = errorResponse.error.errors      
            }
        )
    }

    private showSwalSuccess() {
        Swal.fire({
            title: 'トレーナー申請完了！',
            text: '登録完了まで今しばらくお待ちください！登録完了時または書類に不備がある場合に登録Eメールに通知が届きます。ベータ版につき迷惑フォルダに分類される可能性がありますので合わせてご確認ください',
            type: 'success',
            confirmButtonClass: "btn btn-primary btn-lg",
            buttonsStyling: false
        }).then(() => {
          this.router.navigate(['/rentals'])
        })
    }
}
