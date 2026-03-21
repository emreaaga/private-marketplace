/**
 * Форматирует ID-префикс
 * @param companyId - ID из таблицы companies (например, 22)
 * @param internalNumber - internal_number из таблицы shipments (например, 5)
 * @returns Строка вида "022-00005"
 */
export function formatPublicId(
  companyId: number,
  internalNumber: number,
): string {
  const companyPart = String(companyId).padStart(3, '0');

  const shipmentPart = String(internalNumber).padStart(5, '0');

  return `${companyPart}-${shipmentPart}`;
}
