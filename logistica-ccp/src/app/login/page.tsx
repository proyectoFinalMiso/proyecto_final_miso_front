'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signup } from '../firebase/auth';
import ClipLoader from 'react-spinners/ClipLoader';

const Login: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen">
      <div className=" flex-1 bg-gray-200"></div>
      <div className="  w-[720px] flex items-center justify-center">
        <div className="w-full max-w-md px-8 py-12">
          <h1 className="text-3xl font-normal text-center text-gray-900 mb-8">
            Bienvenido
          </h1>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Introduce tu correo"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Introduce tu contraseña"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="mt-6 min-h-[88px]">
              {loading ? (
                <div className="flex justify-center items-center h-full py-8">
                  <ClipLoader />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <span className="flex items-center">
                      Continuar con correo
                    </span>
                  </button>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Log in con Google
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
