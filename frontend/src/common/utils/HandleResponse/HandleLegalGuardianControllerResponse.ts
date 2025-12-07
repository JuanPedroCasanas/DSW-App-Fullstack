import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleLegalGuardianControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.legalGuardian?.id}, Nombre: ${resJson.legalGuardian?.lastName} ${resJson.legalGuardian?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
      return await HandleErrorResponse(res);
  }
}