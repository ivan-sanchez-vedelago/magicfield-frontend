'use client';

import { useAuth } from '@/src/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type TabType = 'profile' | 'orders';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  subtotal: number;
  customerName: string;
  saleDate: string;
  status: string;
  unitPrice: number;
}

interface GroupedOrder {
  orderId: string;
  saleDate: string;
  total: number;
  items: Order[];
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Cargar órdenes cuando se cambia a la pestaña de órdenes
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${user?.id}`,
        { credentials: 'include' }
      );
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const groupOrdersByOrderId = (): GroupedOrder[] => {
    const grouped: { [key: string]: Order[] } = {};

    orders.forEach((order) => {
      if (!grouped[order.orderId]) {
        grouped[order.orderId] = [];
      }
      grouped[order.orderId].push(order);
    });

    return Object.entries(grouped).map(([orderId, items]) => ({
      orderId,
      saleDate: items[0].saleDate,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
      items,
    }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        await logout();
        router.push('/');
      } else {
        alert('Error al eliminar la cuenta');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Error al eliminar la cuenta');
      setIsDeleting(false);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="normal_text">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="box_border">
          <h1 className="main_title_text mb-6">Mi Cuenta</h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 pb-4 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 pb-4 text-center font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Mis Pedidos
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <p className="small_text text-gray-600 uppercase tracking-wide">
                  Nombre
                </p>
                <input
                  type="text"
                  value={user.name}
                  className={`input_field w-full mb-6`}
                  disabled={true}
                />

                <p className="small_text text-gray-600 uppercase tracking-wide">
                  Apellido
                </p>
                <input
                  type="text"
                  value={user.lastName}
                  className={`input_field w-full mb-6`}
                  disabled={true}
                />

                <p className="small_text text-gray-600 uppercase tracking-wide">
                  Teléfono
                </p>
                <input
                  type="number"
                  value={user.phone}
                  className={`input_field w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  disabled={true}
                />
              </div>

              <div className="pb-4 border-b border-gray-200">
                <p className="small_text text-gray-600 uppercase tracking-wide">
                  Email
                </p>
                <input
                  type="email"
                  value={user.email}
                  className={`input_field w-full`}
                  disabled={true}
                />
              </div>

              <div className="pt-2">
                <p className="small_text text-gray-500">
                  Miembro desde: {new Date().toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`button_danger_secondary medium_button w-full max-w-md`}
                >
                  {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className={`button_danger_primary medium_button w-full max-w-md`}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <p className="normal_text text-center py-8">Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className="normal_text text-center py-8 text-gray-500">
                  No tienes pedidos aún
                </p>
              ) : (
                <div className="space-y-4">
                  {groupOrdersByOrderId().map((groupedOrder) => {
                    const isExpanded = expandedOrder === groupedOrder.orderId;
                    const orderDate = new Date(groupedOrder.saleDate).toLocaleDateString('es-ES');

                    return (
                      <div
                        key={groupedOrder.orderId}
                        className="border border-gray-300 rounded-lg overflow-hidden"
                      >
                        {/* Header - clickeable */}
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              isExpanded ? null : groupedOrder.orderId
                            )
                          }
                          className="w-full p-4 bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                          <p className="normal_text font-medium">
                            Pedido {orderDate}
                          </p>
                          <div className="flex items-center gap-4">
                            <p className="product_price_big_text">
                              ARS$ {groupedOrder.total.toLocaleString('es-ES')}
                            </p>
                            {!isExpanded && (
                              <ChevronDown className="w-6 h-6 flex-shrink-0" />
                            )}
                            {isExpanded && (
                              <ChevronUp className="w-6 h-6 flex-shrink-0" />
                            )}
                          </div>
                        </button>

                        {/* Contenido expandible */}
                        {isExpanded && (
                          <div className="border-t border-gray-300 bg-gray-50 p-4">
                            <div className="space-y-3 mb-4">
                              {groupedOrder.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between bg-white p-4 rounded-2xl border border-gray-200"
                                >
                                  <div className="flex flex-col">
                                    <p className="normal_text font-medium">
                                      {item.productName}
                                    </p>
                                    <p className="product_price_small_text ">
                                      ARS${' '}
                                      {(item.unitPrice).toLocaleString('es-ES')}
                                    </p>
                                  </div>
                                  <div style={{ alignContent: 'center'}}>
                                    <b className="normal_text text-gray-600" style={{ fontWeight: '700'}}>
                                      x{item.quantity}
                                    </b>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal_container flex flex-col gap-4">
            <h2 className="modal_title_text">¿Eliminar cuenta?</h2>
            <p className="normal_text text-gray-600">
              Esta acción es irreversible. Se eliminarán todos tus datos incluyendo tu historial de pedidos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="button_danger_secondary medium_button flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="button_danger_primary medium_button flex-1"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
