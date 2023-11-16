import { Request, Response, NextFunction } from 'express';
import { DataResponse } from '../../../sequelize/utils/http-response';
import { toTitleCase } from '../../utility';
import CountiesData from './counties.json'
export async function GetCounties(req: Request, res: Response, next: NextFunction) {
    try {
        let countiesName = Object.keys(CountiesData);
        res.set('Cache-Control', 'public, max-age=31557600'); 
        DataResponse(res, 200, {
            counties: countiesName.map(x => {
                return {
                    id: x,
                    name: toTitleCase(x),
                }
            }),
            cities: CountiesData
        });

    } catch (err) {
        next(err)
    }
}