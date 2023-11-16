import Joi from 'joi';
import {AnySchema } from 'joi';;

const JoiObjectType = Joi.object({ dummy: Joi.string() })
type JoiSchema = typeof JoiObjectType

export function JoiType<T>(schema: T): T  & JoiSchema {
    const schemaObject = schema
    let schemaInstance: T | JoiSchema = Joi.object(schemaObject as any);
    return schemaInstance as any
}
