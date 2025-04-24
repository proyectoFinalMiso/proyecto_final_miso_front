import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Orders from '@/app/[locale]/orders/page';
import fetchMock from 'jest-fetch-mock';
import * as microserviceOrders from '@/app/[locale]/orders/adapters/microserviceOrders';

import RouteModal from '@/app/[locale]/orders/routeModal';
import { createDeliveryRoute } from '@/app/[locale]/orders/adapters/microserviceOrders';

describe('Vista de pedidos', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify([]));
  });

  it('Validar renderizado de la vista de pedidos', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: '1',
          cliente: 'Cliente A',
          estado: 'En proceso',
          fechaIngreso: '2024-03-24',
        },
      ])
    );
    render(<Orders />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  it('Renderizar tabla de pedidos', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: '1',
          cliente: 'Cliente A',
          estado: 'En proceso',
          fechaIngreso: '2024-03-24',
        },
      ])
    );
    render(<Orders />);
    await waitFor(() => {
      const table = screen.getByRole('grid');
      expect(table).toBeInTheDocument();
    });
  });

  it('Comprobar conexión con backend para obtener pedidos', async () => {
    const orders = await microserviceOrders.getOrders();
    expect(orders).toBeDefined();
  });
});

describe('Modal de ruta de entrega', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Renderizar el modal de ruta', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: '1', direccion: 'Calle Ficticia 123' }])
    );
    render(
      <RouteModal
        open={true}
        onClose={() => {}}
        routeInfo={{
          pedidoId: '1',
          clienteId: 'Cliente A',
          direccion: 'Calle Ficticia 123',
        }}
      />
    );
    await waitFor(() => {
      const modal = screen.getByTitle('Modal ruta de entrega');
      expect(modal).toBeInTheDocument();
    });
  });

  it('Comprobar la creación de la ruta al abrir el modal', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: '1', direccion: 'Calle Ficticia 123' }])
    );
    render(
      <RouteModal
        open={true}
        onClose={() => {}}
        routeInfo={{
          pedidoId: '1',
          clienteId: 'Cliente A',
          direccion: 'Calle Ficticia 123',
        }}
      />
    );
    await waitFor(() => {
      const routeInfo = screen.getByText(/Calle Ficticia 123/i);
      expect(routeInfo).toBeInTheDocument();
    });
  });

  it('Verificar la llamada a la API para crear ruta de entrega', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: '1', direccion: 'Calle Ficticia 123' }])
    );
    const response = await createDeliveryRoute('1');
    expect(response).toBeDefined();
  });
});
