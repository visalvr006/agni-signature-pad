import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'signature-pad';
  signForm!: FormGroup;
  isFormSubmitted = false;
  constructor(private formBuilder: FormBuilder){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.signForm = this.formBuilder.group({
      signature: [""]
    })
  }


  submit(){
    console.log(this.signForm.getRawValue());

  }
}
