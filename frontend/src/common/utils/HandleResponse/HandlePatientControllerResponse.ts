import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandlePatientControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.patient?.id}, Nombre: ${resJson.patient?.lastName} ${resJson.patient?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return await HandleErrorResponse(res);
  }
}