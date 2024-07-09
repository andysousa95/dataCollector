import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private deviceService: DeviceDetectorService) {
    const PORT = 3001;
    const HOST = 'http://localhost';

    this.apiUrl = `${HOST}:${PORT}/clientes`;
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionarCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  async getLocalizacao(): Promise<string> {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.geolocation) {
      return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const endereco = await this.obterEndereco(position.coords.latitude, position.coords.longitude);
              const cidade = endereco.address.city;
              resolve(`Cidade: ${cidade}`);
            } catch (error) {
              if (error instanceof Error) {
                reject(`Erro ao obter nome da cidade: ${error.message}`);
              } else {
                reject('Erro ao obter nome da cidade: erro desconhecido');
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
              reject(`Localização não capturada: ${error.message}`);
            } else {
              reject('Localização não capturada: erro desconhecido');
            }
          }
        );
      });
    } else {
      return Promise.reject('Geolocalização não é suportada neste navegador.');
    }
  }

  async obterEndereco(latitude: number, longitude: number): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Falha ao obter endereço');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar o endereço: ${error.message}`);
      } else {
        throw new Error('Erro ao buscar o endereço: erro desconhecido');
      }
    }
  }

  async getEnderecoIP(): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Falha ao obter endereço IP');
      }
      const data = await response.json();
      return data.ip;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar o endereço IP: ${error.message}`);
      } else {
        throw new Error('Erro ao buscar o endereço IP: erro desconhecido');
      }
    }
  }

  getTipoDispositivo() {
    return this.deviceService.deviceType;
  }
}
