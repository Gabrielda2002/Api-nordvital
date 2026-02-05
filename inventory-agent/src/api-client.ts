import axios, { AxiosInstance } from 'axios';
import { Headquarters, InventoryPayload } from './types/inventory.types';
import * as dotenv from 'dotenv';

export class ApiClient {
  private client: AxiosInstance;
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = dotenv.config().parsed?.API_URL || apiUrl;
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async sendInventory(data: InventoryPayload): Promise<void> {
    try {
      console.log(`📡 Conectando a: ${this.apiUrl}/api/equipos/auto-inventory`);
      
      const response = await this.client.post('/equipos/auto-inventory', data);
      
      console.log('✅ Respuesta del servidor:', response.status, response.statusText);
      
      if (response.data) {
        console.log('📦 Resultado:', response.data.message);
        console.log(`   - Acción: ${response.data.action}`);
        console.log(`   - Equipo ID: ${response.data.equipment.id}`);
        console.log(`   - Componentes: ${response.data.componentsCount}`);
        console.log(`   - Software: ${response.data.softwareCount}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Error de conexión con la API:');
        console.error('  - URL:', error.config?.url);
        console.error('  - Método:', error.config?.method);
        
        if (error.response) {
          console.error('  - Status:', error.response.status);
          console.error('  - Mensaje:', error.response.data);
        } else if (error.request) {
          console.error('  - No se recibió respuesta del servidor');
          console.error('  - Verifica que la API esté ejecutándose');
        } else {
          console.error('  - Error:', error.message);
        }
      } else {
        console.error('❌ Error desconocido:', error);
      }
      throw error;
    }
  }

  async getHeadquartersList(): Promise<Headquarters[]> {
     try {
      
      const response = await this.client.get<Headquarters[]>('/headquarters');
      return response.data; 

     } catch (error: any) {
      throw error;
     }   
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
    this.client.defaults.baseURL = url;
  }
}

export const apiClient = new ApiClient(
  process.env.API_URL || 'http://localhost:3600'
);
