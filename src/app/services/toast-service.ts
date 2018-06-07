import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';


@Injectable()
export class ToastService {

    constructor(private router: Router, public vcr: ViewContainerRef, public toastr: ToastsManager) { 
        this.toastr.setRootViewContainerRef(vcr);
    }

    showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
    }
}