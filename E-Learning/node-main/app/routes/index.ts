'use strict'
import PublicRouter from './public'
import { CoreHttpErrorHandler, RequestParameters } from '../../sequelize/middlewares/error'
import { DataResponse } from '../../sequelize/utils/http-response'
import express, { Request, Response, NextFunction, Router } from 'express'
import cors from 'cors'
import chalk from 'chalk'
import { apiV1Routes } from './api/v1'
import GlobalConfig from '../../configs';
import path from "path"
const PRINT_REQUESTED_URL = true

declare module 'express' {
	interface Request {
	}
}

export default ((): Router => {
	const server = express.Router()

	server.use('*', (req: Request, res: Response, next: NextFunction) => {
		if (PRINT_REQUESTED_URL) console.log(`${req.method}: ${chalk.greenBright(chalk.bold(req.originalUrl))}`)
		return next()
	})

	server.use(cors())

	server.use('/public', express.static(GlobalConfig!.constants.public_directory));

	server.use("/api/v1", apiV1Routes)

	// Public Routes
	server.use(PublicRouter)

	// Global Http Error Handler
	server.use(CoreHttpErrorHandler)

	// Un-recognized Urls
	server.use((req: Request, res: Response) => {
		const params = RequestParameters(req)
		DataResponse(res, 404, { url: req.originalUrl, params }, 'The resource you are looking for is not found!')
	})

	return server
})()
