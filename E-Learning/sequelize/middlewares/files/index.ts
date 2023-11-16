import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import multer from "multer";
import { CoreHttpErrorHandler } from "../error";

const imageFileFilter = (req: Request, file: any, cb: any) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(new Error("File format should be PNG,JPG,JPEG"), false);
	}
};

const upload = multer({
	fileFilter: imageFileFilter,
});

export function ImageFileUploadMulter(
	req: Request,
	res: Response,
	next: NextFunction,
	fileName: string
) {
	let file = upload.single(fileName);

	return file(req, res, (err: any) => {
		next(err);
	});
}
