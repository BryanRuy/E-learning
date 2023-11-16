import { Ebook, User } from "../../../sequelize";
import { SequelizeAttributes } from "../../../sequelize/types";
import _ from "lodash";
import { BadRequestError } from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { EbookPurchase } from "../../../sequelize/models/EbookPurchase";
import { EbookPayments } from "../payment/ebook-payments";

export interface ebookCoreArgs {
  type?: any;
  key: any;
  shouldThrowNotFound?: boolean;
  returns?: SequelizeAttributes;
}

export class EbookCore {
  private static setDefaultArgs(_args: ebookCoreArgs) {
    let args = _.clone(_args);
    args.shouldThrowNotFound = args.shouldThrowNotFound ?? false;
    args.returns = args.returns ?? SequelizeAttributes.WithoutIndexes;
    return args;
  }

  static async GetEbooks(
    returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
  ): Promise<Ebook[]> {
    let ebooks = await Ebook.findAllSafe<Ebook[]>(returns, {
      include: [User],
      raw: true,
      nest: true,
    });

   
    if (ebooks.length == 0) throw new BadRequestError(...a(`No ebook found`));

    return ebooks;
  }


  private static async GetEbookBy(_args: ebookCoreArgs): Promise<Ebook[]> {
    let args = this.setDefaultArgs(_args);

    let ebooks = await Ebook.findAllSafe<Ebook[]>(args.returns, {
      include: [User],
      where: {
        [args.type]: [args.key],
      },
      raw: true,
      nest: true,
    });

    if (ebooks.length == 0 && args.shouldThrowNotFound)
      throw new BadRequestError(...a(`No ebook found`));

    return ebooks;
  }

  static async GetEbookById(args: ebookCoreArgs) {
    args.type = "_ebookId";
    let ebook = await this.GetEbookBy(args);
    return ebook[0];
  }

  static async GetEbookByUuid(args: ebookCoreArgs) {
    args.type = "ebookId";
    let ebook = await this.GetEbookBy(args);
    return ebook[0];
  }

  static async CreateEbook(data: Ebook): Promise<Ebook> {
    let ebook = await Ebook.create<Ebook>(data);
    let res = await this.GetEbookById({ key: ebook._ebookId });
    return res;
  }

  static async UpdateEbook(data: Ebook, ebookId: number): Promise<Ebook> {
    let [isUpdate, ebook] = await Ebook.update<Ebook>(
      { ...data },
      {
        where: {
          _ebookId: ebookId,
        },
      }
    );

    let res = await this.GetEbookById({ key: ebookId });
    return res;
  }

  static async DeleteEbook(ebookId: number): Promise<Ebook[]> {
    let ebook = await Ebook.destroy<Ebook>({
      where: {
        _ebookId: ebookId,
      },
    });
    let res = await this.GetEbooks(SequelizeAttributes.WithoutIndexes);
    return res;
  }

  static async GetUserPurchasedBooks(userId:number):Promise<EbookPurchase[]>{
    let puechasedBooks = await EbookPurchase.findAll({
      where:{
        userId:userId
      }
    })
    return puechasedBooks
  }
}
