import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleModuleControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
    const resJson = await res.json().catch(() => ({}));

    if (res.ok) {
      const successMessage = `${resJson.message} Hora inicio modulos: ${resJson.modules[0].startTime}, 
        Hora Fin modulos: ${resJson.modules[resJson.modules.length - 1].endTime}, 
        Profesional: ${resJson.modules[0].professional.lastName} ${resJson.modules[0].professional.firstName},
        Consultorio: ${resJson.modules[0].consultingRoom.description}`;
      return { message: successMessage, type: "success" };
    } else {
      return await HandleErrorResponse(res);
    }
  }