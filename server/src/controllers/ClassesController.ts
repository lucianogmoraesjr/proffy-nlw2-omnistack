import { Request, Response } from 'express'

import db from '../database/connection';
import convertHoursToMinutes from '../utils/convertHoursToMinutes';

interface ScheduleItem {
  weekday: number;
  from: string;
  to: string;
};

export default class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query;

    const weekday = filters.weekday as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if (!filters.weekday || !filters.subject || !filters.time) {
      return res.status(400).json({
        error: 'Missing filters to search classes'
      })
    }

    const timeinMinutes = convertHoursToMinutes(time);

    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`weekday` = ??', [Number(weekday)])
          .whereRaw('`class_schedule`.`from` <= ??', [Number(timeinMinutes)])
          .whereRaw('`class_schedule`.`to` > ??', [Number(timeinMinutes)])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*'])

    return res.send(classes);
  }

  async create(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;
  
    const trx = await db.transaction();
  
    try {
      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });
    
      const user_id = insertedUsersIds[0];
    
      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
    
      const class_id = insertedClassesIds[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          weekday: scheduleItem.weekday,
          from: convertHoursToMinutes(scheduleItem.from),
          to: convertHoursToMinutes(scheduleItem.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
    
      await trx.commit();
    
      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
  
      return res.status(400).json({
        error: "Unexpected error while creating new class"
      });
    }
  }
}