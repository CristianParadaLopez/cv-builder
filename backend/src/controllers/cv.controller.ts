import { Request, Response } from "express";
import { generateCV, editCV } from "../services/claude.service";

// eu chambea
export async function handleGenerateCV(req: Request, res: Response) {
  try {
    const { formData, style } = req.body;
    if (!formData) {
      return res.status(400).json({ error: "Los datos del formulario son requeridos" });
    }
    const html = await generateCV(formData, style || "moderno");
    return res.status(200).json({ html });
  } catch (error) {
    console.error("Error generando CV:", error);
    return res.status(500).json({ error: "Error al generar el CV" });
  }
}

export async function handleEditCV(req: Request, res: Response) {
  try {
    const { currentHTML, prompt } = req.body;
    if (!currentHTML || !prompt) {
      return res.status(400).json({ error: "El HTML y el prompt son requeridos" });
    }
    const html = await editCV(currentHTML, prompt);
    return res.status(200).json({ html });
  } catch (error) {
    console.error("Error editando CV:", error);
    return res.status(500).json({ error: "Error al editar el CV" });
  }
}