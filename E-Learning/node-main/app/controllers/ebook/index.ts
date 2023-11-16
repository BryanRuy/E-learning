import e, { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";
import { a } from "../../../sequelize/locales";
import {
  ApplicationError,
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { Configurations } from "../../../configs/config-main";
import fs from "fs";
import { EbookCore } from "../../services/ebook";
import { SequelizeAttributes } from "../../../sequelize/types";
import * as path from "path";
import { CoreHttpErrorHandler } from "../../../sequelize/middlewares/error";
import { Ebook } from "../../../sequelize";
import { EbookPayments } from "../../services/payment/ebook-payments";
import { EbookPurchase } from "../../../sequelize/models/EbookPurchase";

export async function CreateEbook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let ebook = req.body;

    let userId = req.CurrentUser?._userId;
    ebook.userId = userId;

    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );     

    if (Array.isArray(req.files)) {
      for (let file of req.files as any) {
        let fileExts = file.originalname.split(".");
        let ext = fileExts[fileExts.length - 1];
        let fileName = `${v4()}.${ext}`;
        if (
          ["coverImage", "previewImage", "bookUrl"].indexOf(file.fieldname) > -1
        ) {
          let { ebooks_pdfs, ebooks_images } = Configurations.constants;
          let dest = file.fieldname == "bookUrl" ? ebooks_pdfs : ebooks_images;
          fs.writeFileSync(`${dest}/${fileName}`, file.buffer);
          ebook[file.fieldname] =
            file.fieldname == "bookUrl" ? `${fileName}` : `/ebooks/${fileName}`;
        }
      }
    }
    
    let ebookRes = await EbookCore.CreateEbook(ebook);
    ebookRes = JSON.parse(JSON.stringify(ebookRes));
    ebookRes.bookUrl;
    DataResponse(res, 200, ebook);
  } catch (err) {
    next(err);
  }
}

export async function GetEbooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let purchasedBooks: EbookPurchase[] = [];
    let ebookRes = (await EbookCore.GetEbooks(
      SequelizeAttributes.WithIndexes
    )) as any;
    ebookRes = JSON.parse(JSON.stringify(ebookRes));

    if (role == "student" || role == "teacher") {
      purchasedBooks = await EbookCore.GetUserPurchasedBooks(userId);
      let purchasedBooksMap = new Map();
      purchasedBooks.forEach((ebook) => {
        purchasedBooksMap.set(ebook.ebookId, ebook);
      });

      ebookRes.forEach((book: any) => {
        book.isPurchased = !!purchasedBooksMap.get(book._ebookId);
      });
    }

    ebookRes.forEach((e: any) => {
      delete e.bookUrl;
      delete e._ebookId;
      delete e.userId;
      delete e.user._userId;
    });

    DataResponse(res, 200, ebookRes);
  } catch (err) {
    next(err);
  }
}

export async function UpdateEbook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let ebook: any = req.body;

    let userId = req.CurrentUser?._userId;
    ebook.userId = userId;

    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    if (!ebook) throw new BadRequestError(...a(`Select a book first`));

    let ebookData = await EbookCore.GetEbookByUuid({
      key: ebook.ebookId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    });

    let ebookDataToUpdate: any = {
      title: ebook.title,
      description: ebook.description,
    };

    if (Array.isArray(req.files)) {
      for (let file of req.files as any) {
        let fileExts = file.originalname.split(".");
        let ext = fileExts[fileExts.length - 1];
        let fileName = `${v4()}.${ext}`;
        if (file.fieldname == "coverImage") {
          fs.writeFileSync(
            `${Configurations.constants.ebooks_images}/${fileName}`,
            file.buffer
          );
          ebookDataToUpdate.coverImage = `/ebooks/${fileName}`;
        } else if (file.fieldname == "previewImage") {
          fs.writeFileSync(
            `${Configurations.constants.ebooks_images}/${fileName}`,
            file.buffer
          );
          ebookDataToUpdate.previewImage = `/ebooks/${fileName}`;
        } else if (file.fieldname == "bookUrl") {
          fs.writeFileSync(
            `${Configurations.constants.ebooks_pdfs}/${fileName}`,
            file.buffer
          );
          ebookDataToUpdate.bookUrl = `${fileName}`;
        }
      }
    }
    let ebookRes = await EbookCore.UpdateEbook(
      ebookDataToUpdate,
      ebookData._ebookId
    );
    ebookRes = JSON.parse(JSON.stringify(ebookRes));
    ebookRes.bookUrl;
    DataResponse(res, 200, ebook);
  } catch (err) {
    next(err);
  }
}

export async function DeleteEbooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.CurrentUser?._userId;
    let { ebookId } = req.body;

    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    if (!ebookId) throw new BadRequestError(...a(`Please select a book`));

    let ebook = await EbookCore.GetEbookByUuid({
      key: ebookId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    });

    let ebookRes = await EbookCore.DeleteEbook(ebook._ebookId);
    ebookRes = JSON.parse(JSON.stringify(ebookRes));
    ebookRes.forEach((e) => {
      delete e.bookUrl;
    });

    DataResponse(res, 200, ebookRes);
  } catch (err) {
    next(err);
  }
}

export async function BuyEbook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.CurrentUser?.userId;
    let userRole = req.CurrentUser?.roleId;
    let ebookId = req.params.ebookId ?? "";
    let token = req.params.token;

    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let ebook = await EbookCore.GetEbookByUuid({
      key: ebookId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    });

    let ebookPurchaseRes: any;
    let hasPurchased;
    if (userRole !== "admin" && userRole !== "super-admin") {
      let ebookPayment = await EbookPayments.init(userId);
      hasPurchased = await ebookPayment.hasPurchased(ebook.ebookId);
      if (!hasPurchased) {
        ebookPurchaseRes = await ebookPayment.purchase(ebook.ebookId, token);
      } else {
        let updateLocallyEbook = await ebookPayment.updatePurchasedBookLocally(ebook._ebookId)
      }
    }  
    if (hasPurchased) {
      req.Ebook = ebook;
      return next();
    } else if (ebookPurchaseRes.status == "authentication_required") {
      ebookPurchaseRes.code = "authentication_required"
      return DataResponse(res, 200, ebookPurchaseRes);
    }
  } catch (error) {
    return CoreHttpErrorHandler(error, req, res, next);
  }
}

export async function GetEbookContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.CurrentUser?._userId;
    let ebook = req.Ebook;

    if (!userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    if (!ebook) throw new BadRequestError(...a(`Please select a book`));
    let filePath = path.join(
      Configurations.constants.ebooks_pdfs,
      ebook.bookUrl!
    );  

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("Resource your are looking for is not found.");
      } else {
        res.writeHead(200, { "Content-type": "application/pdf" });
        res.end(data);
      }
    });
  } catch (err) {
    next(err);
  }
}
