import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleHealthInsuranceControllerResponse (res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.healthInsurance?.id}, Nombre: ${resJson.healthInsurance?.name}`;
    return { message: successMessage, type: "success" };
  } else {
    return await HandleErrorResponse(res);
  }
}