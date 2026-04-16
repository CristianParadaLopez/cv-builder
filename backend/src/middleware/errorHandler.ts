import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Error interno del servidor" });
}
// este middleware es un manejo de errores que captura cualquier error que ocurra en las rutas o controladores de la aplicación
// imprime el mensaje de error en la consola y devuelve una respuesta JSON.