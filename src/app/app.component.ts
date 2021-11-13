import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  //flag para indicar se o usuário está autenticado
  isAuthenticated: boolean = false;

  //dados do usuario
  usuario: any = {
    nome: '',
    email: ''
  }

  //construtor
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private accountService: AccountService
  ) { }

  //função executada quando o componente é renderizado
  ngOnInit(): void {

    //verificar se o usuário está autenticado
    var token = this.tokenService.getAccessToken();
    this.isAuthenticated = token != null && token != undefined;

    //se o usuario estiver autenticado, iremos capturar os dados do usuario na API
    if (this.isAuthenticated) {

      this.accountService.userData()
        .subscribe(
          (data: any) => {
            this.usuario.nome = data.nome;
            this.usuario.email = data.email;
          },
          (e: any) => {
            console.log(e);
          }
        );

    }
  }

  //evento para fazer o logout do usuário
  logout(): void {

    if (window.confirm('Deseja realmente encerrar sua sessão?')) {

      //remover o token do usuário autenticado
      this.tokenService.removeAccessToken();

      //redirecionar o usuario de volta para a página de login
      this.router.navigate(['/'])
        .then(() => {
          window.location.reload();
        });
    }
  }

}
