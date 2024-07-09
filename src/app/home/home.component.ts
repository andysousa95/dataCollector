import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ServicosService } from '../servicos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localizacao: string = '';
  enderecoIP: string = '';
  tipoDevice: string = '';
  countdown: number = 5;
  intervalId: any;
  urlPesquisa: string = 'https://forms.office.com/r/mC0h3mLgUV?origin=lprLink';
  isBrowser: boolean;

  constructor(
    private servicosService: ServicosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.capturarDados();
      this.iniciarCountdown();
    }
  }

  capturarDados() {
    this.servicosService.getLocalizacao().then(localizacao => {
      this.localizacao = localizacao;
    }).catch(error => {
      console.error('Erro ao obter localização:', error);
    });

    this.servicosService.getEnderecoIP().then(enderecoIP => {
      this.enderecoIP = enderecoIP;
    }).catch(error => {
      console.error('Erro ao obter endereço IP:', error);
    });

    this.tipoDevice = this.servicosService.getTipoDispositivo();
  }

  iniciarCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.enviarDadosERedirecionar();
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  enviarDados() {
    const dados = {
      URLpesquisa: this.urlPesquisa,
      localidade: this.localizacao,
      ip: this.enderecoIP,
      tipo_dispositivo: this.tipoDevice
    };

    this.servicosService.adicionarCliente(dados).subscribe(
      response => {
        console.log('Dados enviados com sucesso!', response);
        this.redirecionar();
      },
      error => {
        console.error('Erro ao enviar dados para o backend:', error);
        this.redirecionar();
      }
    );
  }

  enviarDadosERedirecionar() {
    this.enviarDados();
  }

  redirecionar() {
    if (this.isBrowser) {
      setTimeout(() => {
        window.location.href = this.urlPesquisa;
      }, 0);
    }
  }

  redirecionarManual() {
    clearInterval(this.intervalId);
    this.enviarDadosERedirecionar();
  }
}
