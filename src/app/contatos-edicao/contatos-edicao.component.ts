import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContatosService } from '../services/contatos.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-contatos-edicao',
  templateUrl: './contatos-edicao.component.html',
  styleUrls: ['./contatos-edicao.component.css']
})
export class ContatosEdicaoComponent implements OnInit {

  mensagem_sucesso: string = "";
  mensagem_erro: string = "";

  isLoading: boolean = false;

  constructor(
    private tokenService: TokenService, //injeção de dependência
    private contatosService: ContatosService, //injeção de dependência
    private activatedRoute: ActivatedRoute //injeção de dependência
  ) { }

  //criando o formulário
  formEdicao = new FormGroup({

    //campo 'idContato'
    idContato: new FormControl('', []),

    //campo 'nome'
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150)
    ]),

    //campo 'email'
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    //campo 'telefone'
    telefone: new FormControl('', [
      Validators.required
    ]),

  })

  //função para acessar os campos do formulario
  get form(): any {
    return this.formEdicao.controls;
  }

  ngOnInit(): void {

    this.tokenService.verifyIsNotAuthenticated();

    this.isLoading = true;

    //capturar o id do contato enviado pela URL
    var idContato = this.activatedRoute.snapshot.paramMap.get('id') as string;

    //buscando o contato na API atraves do ID..
    this.contatosService.getById(idContato)
      .subscribe(
        (data: any) => { //retorno de sucesso da API

          //preencher os campos do formulario com os dados do contato
          this.formEdicao.controls.idContato.setValue(data.idContato);
          this.formEdicao.controls.nome.setValue(data.nome);
          this.formEdicao.controls.email.setValue(data.email);
          this.formEdicao.controls.telefone.setValue(data.telefone);
          this.isLoading = false;
        },
        (e: any) => { //retorno de erro da API
          console.log(e);
          this.isLoading = false;
        }
      );
  }

  //função para executar o SUBMIT do formulário
  onSubmit(): void {

    this.isLoading = true;

    this.mensagem_sucesso = "";
    this.mensagem_erro = "";

    //requisição de edição para a API..
    this.contatosService.put(this.formEdicao.value)
      .subscribe(
        (data: any) => {
          this.mensagem_sucesso = data.message;
          this.isLoading = false;
        },
        (e: any) => {
          this.mensagem_erro = e.error;
          this.isLoading = false;
        }
      );

  }

}
