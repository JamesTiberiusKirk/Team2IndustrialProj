import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private route: Router, private rest: RestService) { }

  ngOnInit(): void {
  }

  onSubmit(nick: string) {
    this.rest.register(nick).subscribe((data) =>
      this.rest.createRoom(data.user_id.toString()).subscribe((data) => 
        this.rest.joinRoom(data.room_id.toString(), data.room_key).subscribe((data) => { console.log(data) })));
  }

}
