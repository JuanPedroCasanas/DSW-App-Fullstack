import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleAppointmentControllerResponse(res: Response): Promise<{ message: string; type: 'success' | 'error' }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage =
      `${resJson.message ?? 'Operación exitosa'}` +
      (resJson.consultingRoom
        ? ` Id: ${resJson.consultingRoom?.id}, Nombre: ${resJson.consultingRoom?.description}`
        : resJson.appointment
        ? ` Turno: ${resJson.appointment?.id ?? ''}`
        : '');
    return { message: successMessage.trim(), type: 'success' };
  } else {
    return await HandleErrorResponse(res);
  }
}
