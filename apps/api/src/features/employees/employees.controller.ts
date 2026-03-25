import type { NextFunction, Request, Response } from 'express';
import { EmployeesRepository } from './employees.repository.js';
import { EmployeesService } from './employees.service.js';
import { parseEmployeesQuery } from './employees.utils.js';

const employeesService = new EmployeesService(new EmployeesRepository());

export async function getEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const query = parseEmployeesQuery(req.query as Record<string, unknown>);
    const result = await employeesService.listEmployees(query);

    res.status(200).set('Cache-Control', 'no-store').json(result);
  } catch (error) {
    next(error);
  }
}