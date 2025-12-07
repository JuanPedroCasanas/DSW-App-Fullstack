import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleProfessionalControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Nombre: ${resJson.professional?.lastName} ${resJson.professional?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return await HandleErrorResponse(res);
  }
}