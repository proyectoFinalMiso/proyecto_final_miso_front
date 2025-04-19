const apiURI = 'https://cr-bff-webapp-488938258128.us-central1.run.app';

export const getOrders = async (): Promise<any[]> => {
  const url =
    apiURI +
    '/api/gestorPedidos/pedidos?cliente_id=9b5d684f-e787-4184-9194-19ff0516800e';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      const error_msg = await response.text();
      throw new Error('No ha sido posible listar los pedidos: ' + error_msg);
    }

    return data.pedidos || [];
  } catch (error) {
    console.error('No ha sido posible listar los pedidos', error);
    return [];
  }
};

export const createDeliveryRoute = async (orderId: string): Promise<any[]> => {
  /* const pedidosUri = 'http://localhost:3002'; */
  /* const url = pedidosUri + '/pedido/ruta_de_entrega'; */
  const url = apiURI + '/api/gestorPedidos/pedido/ruta_de_entrega';
  const body = {
    pedido_id: orderId,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(
        'No ha sido posible crear una ruta de entrega: ' + responseBody
      );
    }

    const data = JSON.parse(responseBody);
    return data.msg || [];
  } catch (error) {
    console.error('No ha sido crear una ruta de entrega', error);
    return [];
  }
};
