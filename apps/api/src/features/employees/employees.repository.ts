import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Employee, EmployeeRaw } from './employees.types.js';
import { isEmployeeRaw, normalizeEmployeeDates } from './employees.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const employeesFilePath = path.resolve(__dirname, '../../../data/employees.json');

export class EmployeesRepository {
  private cache: Employee[] | null = null;

  async getAll(): Promise<Employee[]> {
    if (this.cache) {
      return this.cache;
    }

    const fileContent = await fs.readFile(employeesFilePath, 'utf8');

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(fileContent);
    } catch {
      throw new Error('Failed to parse employees JSON file');
    }

    if (!Array.isArray(parsedData)) {
      throw new Error('Employees JSON is not an array');
    }

    if (!(parsedData as unknown[]).every(isEmployeeRaw)) {
      throw new Error('Employees JSON has invalid record shape');
    }

    this.cache = (parsedData as EmployeeRaw[]).map(normalizeEmployeeDates);
    return this.cache;
  }
}