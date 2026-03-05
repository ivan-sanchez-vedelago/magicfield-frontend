'use client';

import LoadingLink from "@/src/components/navigation/LoadingLink";

export default function CheckoutSuccess() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center px-6">
        <h1 className="main_title_text">Compra realizada</h1>
        <p className="normal_text text-gray-400 mt-2 mb-8">
          Te enviamos un email de confirmación con los detalles de tu compra. Nos comunicaremos contigo a la brevedad para coordinar la entrega.
        </p>
        <LoadingLink
          href="/products"
          className="button_primary medium_button inline-block w-60"
        >
          Volver
        </LoadingLink>
      </div>
    </div>
  );
}
