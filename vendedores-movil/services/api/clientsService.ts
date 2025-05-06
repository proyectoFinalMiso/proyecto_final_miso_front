import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_CLIENTES;

export interface Cliente {
    id: string;
    nombre: string;
    correo: string;
}

export interface ClienteData {
    cliente: {
        id: string;
        nombre: string;
        correo: string;
        vendedorAsociado: string;
    };
}

export interface VisitPayload {
    vendedor_id: string;
    fecha: string;
    estado: string;
}

export interface VisitResponse {
    body: any;
    msg: string;
}

export interface ClientesResponse {
    clientes: Cliente[];
    msg: string;
}

export interface Visit {
    id: number;
    cliente_id: string;
    vendedor_id: string;
    estado: string;
    fecha: string;
}

export interface VisitsResponse {
    visitas: Visit[];
    msg?: string;
}

export interface VideoUploadResponse {
    body: any;
    msg: string;
}

// Fetch all seller's clients
export const fetchClients = async (vendedorId: string): Promise<Cliente[]> => {
    try {
        const response = await axios.get<ClientesResponse>(`${API_BASE_URL}/clientes?vendedor_id=${vendedorId}`);
        return response.data.clientes;
    } catch (error) {
        console.error('Error fetching available clients:', error);
        throw error;
    }
};

// Fetch a single client by ID
export const fetchClientById = async (clientId: string): Promise<ClienteData> => {
    try {
        const response = await axios.get<ClienteData>(`${API_BASE_URL}/${clientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching client by ID:', error);
        throw error;
    }
};

// Map API data to application Client model
export const mapClientesToProducts = (clientesItems: Cliente[]) => {
    return clientesItems.map(item => ({
        id: item.id,
        name: item.nombre,
    }));
};

// Send a visit to the API
export const sendVisit = async (clienteID:string, vendedorId: string, fecha: string, estado: string): Promise<VisitResponse> => {
    try {
        const payload: VisitPayload = {
            vendedor_id: vendedorId,
            fecha,
            estado,
        };

        const response = await axios.post<VisitResponse>(`${API_BASE_URL}/${clienteID}/registrar_visita`, payload);
        return response.data;
    } catch (error) {
        console.error('Error sending visit:', error);
        throw error;
    }
};

// Fetch all past visits for a specific client
export const fetchPastVisits = async (clientId: string): Promise<Visit[]> => {
    try {
        const response = await axios.get<VisitsResponse>(`${API_BASE_URL}/visitas?cliente_id=${clientId}&estado=completada`);
        return response.data.visitas;
    } catch (error) {
        console.error('Error fetching past visits:', error);
        throw error;
    }
};

// Upload a video for a specific client
export const uploadClientVideo = async (
  clientId: string,
  videoUri: string,
  vendedorId: string
): Promise<VideoUploadResponse> => {
  try {
    const formData = new FormData();
    
    const filename = videoUri.split('/').pop() || 'video.mp4';
    
    formData.append('video', {
      uri: videoUri,
      name: filename,
      type: 'video/mp4',
    } as any);
    
    formData.append('vendedor_id', vendedorId);
    formData.append('cliente_id', clientId);
    
    const response = await axios.post<VideoUploadResponse>(
      `${API_BASE_URL}/${clientId}/videos`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};
